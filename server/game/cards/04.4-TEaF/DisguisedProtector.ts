import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class DisguisedProtector extends DrawCard {
    static id = 'disguised-protector';

    setupCardAbilities() {
        this.action('Add each players honor bid to their skill total')
            .condition((context) => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.changePlayerSkillModifier(context.player.showBid)
            })), AbilityDsl.actions.playerLastingEffect((context) => ({
                condition: (context: AbilityContext) => !!context.player.opponent,
                targetController: context.player.opponent,
                effect: AbilityDsl.effects.changePlayerSkillModifier(context.player.opponent ? context.player.opponent.showBid : 0)
            })))
            .effect('add the bid on each players dial to their skill total');
    }
}


export default DisguisedProtector;
