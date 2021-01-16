const repos_panel = new Vue({
    el: '#repos_panel',
    data: {
        repos: []
    }
})

const games_panel = new Vue({
    el: '#games_panel',
    data: {
        games: []
    }
})

fetch('https://api.github.com/users/CdecPGL/repos').then((response) => {
    return response.json();
}).then((response) => {
    repos_panel.repos = response.filter((r) => {
        return r.stargazers_count > 0;
    }).map((r) => {
        const updateDatetime = new Date(r.updated_at);
        const updateDatetimeString = `${updateDatetime.getFullYear()}年${updateDatetime.getMonth() + 1}月${updateDatetime.getDate()}日`
        return {
            name: r.name,
            description: r.description,
            url: r.url,
            starCount: r.stargazers_count,
            language: r.language,
            updateDatetime: updateDatetimeString
        }
    }).sort((a, b) => b.starCount - a.starCount);
});

games_panel.games = GAMES.map(g => {
    return {
        header: getGameHeader(g),
        title: g.name,
        body: g.description,
        footers: getGameFooters(g),
        thumbnails: g.thumbnails,
    }
})

function getGameHeader(g) {
    switch (g.state) {
        case GAME_STATE_DEVELOPING:
            if (!isNullOrUndefined(g.releaseDate)) {
                return `${getTextFromDatetimeArray(g.releaseDate)}公開予定（開発中）`;
            }

            return '開発中';
        case GAME_STATE_RELEASED:
            if (!isNullOrUndefined(g.updateDate)) {
                return `${getTextFromDatetimeArray(g.updateDate)}更新`;
            }

            if (!isNullOrUndefined(g.releaseDate)) {
                return `${getTextFromDatetimeArray(g.releaseDate)}公開`;
            }

            return '公開中';
    }
}

function getGameFooters(g) {
    return [
        'バージョン: v' + g.version.join('.'),
        'ジャンル: ' + g.genre,
        'プラットフォーム: ' + g.platforms.join(', ')
    ]
}