Vue.use(BootstrapVue)

new Vue({
    el: "#navbar",
    data: {
    },
    methods: {
    }
})

new Vue({
    el: "#repos-abstract",
    data: {
    },
    methods: {
    }
})

const repos_panel = new Vue({
    el: '#repos-panel',
    data: {
        repos: []
    }
})

const developing_games_panel = new Vue({
    el: '#developing-games-panel',
    data: {
        games: []
    }
})

const released_games_panel = new Vue({
    el: '#released-games-panel',
    data: {
        games: []
    }
})

fetch('https://api.github.com/users/CdecPGL/repos').then((response) => {
    return response.json();
}).then((response) => {
    repos_panel.repos = response.filter((r) => {
        return r.stargazers_count > 0 || r.forks_count > 0;
    }).map((r) => {
        return {
            title: r.name,
            body: r.description,
            url: r.html_url,
            starCount: r.stargazers_count,
            forkCount: r.forks_count,
            footers: getRepoFooters(r),
        }
    }).sort((a, b) => b.starCount - a.starCount);
});

developing_games_panel.games = GAMES.filter(g => g.state === GAME_STATE_DEVELOPING).map(g => {
    return {
        header: getGameHeader(g),
        title: g.name,
        body: g.description,
        footers: getGameFooters(g),
        thumbnails: g.thumbnails,
        url: g.url,
    }
})

released_games_panel.games = GAMES.filter(g => g.state === GAME_STATE_RELEASED).map(g => {
    return {
        header: getGameHeader(g),
        title: g.name,
        body: g.description,
        footers: getGameFooters(g),
        thumbnails: g.thumbnails,
        url: g.url,
    }
})

function getRepoFooters(r) {
    const updateDatetime = new Date(r.pushed_at);
    const updateDatetimeString = `${updateDatetime.getFullYear()}年${updateDatetime.getMonth() + 1}月${updateDatetime.getDate()}日`;

    return [
        '言語: ' + r.language,
        '更新: ' + updateDatetimeString,
    ]
}

function getGameHeader(g) {
    switch (g.state) {
        case GAME_STATE_DEVELOPING:
            if (!isNullOrUndefined(g.releaseDate)) {
                return `${getTextFromDatetimeArray(g.releaseDate)}公開予定`;
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