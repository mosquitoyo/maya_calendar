import _ from 'lodash'

export function useToneList() {
    const toneNames = ['磁性', '月亮', '電力', '自我存在', '超頻', '韻律', '共鳴', '銀河星系', '太陽', '行星', '光譜', '水晶', '宇宙']
    const toneList = _.map(toneNames, (name, index) => {
        return {
            id: index + 1,
            name: name,
            url: new URL(`/src/assets/tone/tone-${_.padStart(index + 1, 2, '0')}.png`, import.meta.url)
        }
    })
    return toneList;
}

export function useSealList() {
    const sealNames = ['紅龍', '白風', '藍夜', '黃種子', '紅蛇', '白世界橋', '藍手', '黃星星', '紅月', '白狗',
        '藍猴', '黃人', '紅天行者', '白巫師', '藍鷹', '黃戰士', '紅地球', '白鏡', '藍風暴', '黃太陽']
    const sealList = _.map(sealNames, (name, index) => {
        return {
            id: index + 1,
            name: name,
            url: new URL(`/src/assets/seal/seal-${_.padStart(index + 1, 2, '0')}.png`, import.meta.url)
        }
    })
    return sealList;
}