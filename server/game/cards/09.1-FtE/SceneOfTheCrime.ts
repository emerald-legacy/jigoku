import type BaseCard from '../../BaseCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SceneOfTheCrime extends ProvinceCard {
    static id = 'scene-of-the-crime';

    public setupCardAbilities() {
        this.reaction('Look at opponent\'s hand')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .gameAction(AbilityDsl.actions.lookAt((context) => ({
                target: (context.player.opponent?.hand ?? []).slice().sort((a: BaseCard, b: BaseCard) => a.name.localeCompare(b.name)),
                chatMessage: true
            })))
            .effect('look at {1}\'s hand', (context) => context.player.opponent ?? '');
    }
}
