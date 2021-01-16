const GAME_STATE_DEVELOPING = 'developing';
const GAME_STATE_RELEASED = 'released';

function getTextFromDatetimeArray(datetime) {
    let result = '';
    for (let i = 0; i < datetime.length; ++i) {
        result += datetime[i];
        result += getDatetimeSuffix(i);
    }
    return result;
}

function getDatetimeSuffix(index) {
    switch (index) {
        case 0:
            return '年';
        case 1:
            return '月';
        case 2:
            return '日';
        case 3:
            return '時';
        case 4:
            return '分';
        case 5:
            return '秒';
        default:
            return '';
    }
}

function isNullOrUndefined(value) {
    return value === null || typeof value === 'undefined';
}
