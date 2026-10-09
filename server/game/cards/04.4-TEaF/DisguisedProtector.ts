import { changePlayerSkillModifier } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class DisguisedProtector extends DrawCard {
    static id = 'disguised-protector';

    setupCardAbilities() {
        this.action('Add each players honor bid to their skill total')
            .condition((context) => context.source.isParticipating())
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: changePlayerSkillModifier(context.player.showBid)
            }))
            .playerLastingEffect((context) => ({
                condition: (context) => !!context.player.opponent,
                targetController: context.player.opponent,
                effect: changePlayerSkillModifier(context.player.opponent ? context.player.opponent.showBid : 0)
            }))
            .chatText('add the bid on each players dial to their skill total');
    }
}


export default DisguisedProtector;
