import Event from "../entity/Event.js";
import gameManager from "../manager/GameManager.js";

const defaultEvents = [
    new Event({
        id: 'banglife:一年级第一学期开始',
        title: '新学期开始',
        description: (player) => {
            return '四月上旬，料峭的春寒尚未散却。<br>' +
                '心中满怀憧憬，你穿过人潮熙熙攘攘，步入高中校门。<br>' +
                `你将作为${player.attributes.school}${player.attributes.grade} ${player.attributes.class}的新生，度过为期三年的学园生活。`;
        },
        priority: 1,
        condition: () => gameManager.round === 1,
        action: (player) => {
            const randomSchool = Math.random()
            if (randomSchool < 0.33) player.attributes.school = '月之森女子学园';
            else if (0.33 <= randomSchool && randomSchool < 0.66) player.attributes.school = '羽丘女子学园'
            else player.attributes.school = '花咲川女子学园';

            player.attributes.grade = '高中一年级';

            const randomClass = Math.random()
            if (randomClass < 0.5) player.attributes.class = 'A 组';
            else player.attributes.class = 'B 组';
        }
    }),
    new Event({
        id: 'banglife:RiNG 咖啡厅',
        title: 'RiNG 咖啡厅',
        description: (player) => {
            return '放学过后，你走进 RiNG 咖啡厅。<br>' +
                '咖啡的浓郁醇香裹着奶油的甜腻，扑面而来。<br>' +
                `「啊，是小${player.alias}。今天要来些什么？」<br>` +
                '柜台后的凛凛子小姐停下手中擦拭咖啡杯的动作，笑着朝你挥了挥手。';
        },
        weight: 1,
        options: [
            new Event({
                id: 'banglife:RiNG 咖啡厅:热伯爵红茶',
                title: '热伯爵红茶',
                description: '你点了一杯热伯爵红茶。<br>' +
                    '凛凛子小姐将茶杯放在你面前，佛手柑的清香随着热气缓缓升腾。<br>' +
                    '喝上一口，你感到整个人都放松下来。<br>' +
                    '活力 +1。<br>',
                action: (player) => {
                    player.addEnergy(1);
                }
            }),
            new Event({
                id: 'banglife:RiNG 咖啡厅:抹茶巴菲',
                title: '抹茶巴菲',
                description: '你点了一份抹茶巴菲。<br>' +
                    '「抹茶巴菲~♪」<br>' +
                    '银色短发的女孩子从柜台后探出头来，目不转睛地盯着你的抹茶巴菲，你忍不住舀起一勺递到她嘴边。<br>' +
                    '要乐奈 好感度 +10。',
                condition: (player) => player.getAffection('要乐奈') < 10,
                action: (player) => {
                    player.setAffection('要乐奈', 10)
                }
            })
        ]
    }),
    new Event({
        id: 'banglife:Poppin\'Party 的星空下露营',
        title: 'Poppin\'Party 的星空下露营',
        description: '「大家一起来露营吧！」户山香澄举着露营手册，眼睛闪闪发光，「在星空下弹吉他，想想就超棒！」<br>' +
            '牛込里美抱着贝斯，「我已经准备好新写的曲子了～」<br>' +
            '花园多惠抱着兔子，「篝火已经生好了哦。」<br>' +
            '山吹沙绫端着刚烤好的海螺包，「大家快趁热吃吧！」<br>' +
            '市谷有咲无奈地扶额，「真是的，又要我来收拾烂摊子……」嘴上抱怨，却还是帮着搭好了帐篷。<br>' +
            '夜晚，你们围坐在篝火旁，香澄弹着吉他唱起歌，星空在头顶铺开，晚风带着草木的清香。<br>' +
            '香澄看向你，笑着说「能和大家、和你一起，真的太幸福了！」<br>' +
            'Poppin\'Party 全成员好感度 +2，体质 +1。',
        priority: 0,
        weight: 2,
        condition: (player) => 64 <= gameManager.round && gameManager.round <= 68 && player.getAffection('户山香澄') >= 15,
        action: (player) => {
            player.addAffection('户山香澄', 2);
            player.addAffection('牛込里美', 2);
            player.addAffection('花园多惠', 2);
            player.addAffection('山吹沙绫', 2);
            player.addAffection('市谷有咲', 2);
            player.attributes.stamina += 1;
        },
        cost: 1,
        author: '见冬'
    })
];

export default defaultEvents;