import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SceneOfTheCrime extends ProvinceCard {
    static id = 'scene-of-the-crime';

    public setupCardAbilities() {
        this.reaction({
            title: 'Look at opponent\'s hand',
            when: {
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            },
            effect: 'look at {1}\'s hand',
            effectArgs: (context) => context.player.opponent,
            gameAction: AbilityDsl.actions.lookAt((context) => ({
                target: context.player.opponent.hand.slice().sort((a, b) => a.name.localeCompare(b.name)),
                chatMessage: true
            }))
        });
    }
}
