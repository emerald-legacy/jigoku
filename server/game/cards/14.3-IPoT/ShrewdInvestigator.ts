import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { shuffle } from '../../utils/shuffle.js';

export default class ShrewdInvestigator extends DrawCard {
    static id = 'shrewd-investigator';

    setupCardAbilities() {
        this.action({
            title: 'Look at random cards from your opponent\'s hand',
            condition: (context) => context.source.isParticipating() && context.player.opponent !== undefined,
            gameAction: AbilityDsl.actions.lookAt((context) => ({
                target: (shuffle(context.player.opponent.hand as DrawCard[])
                    .slice(0, context.player.getNumberOfFacedownProvinces()) as DrawCard[])
                    .sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name))
            })),
            effect: 'look at {1} random card{3} in {2}\'s hand',
            effectArgs: (context) => [
                context.player.getNumberOfFacedownProvinces(),
                context.player.opponent as Player,
                context.player.getNumberOfFacedownProvinces() === 1 ? '' : 's'
            ]
        });
    }
}
