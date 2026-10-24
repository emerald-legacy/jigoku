import { changePlayerResolutionSkillModifier } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class DisguisedProtector extends DrawCard {
    static id = 'disguised-protector';

    override setupCardAbilities() {
        this.action('Add each players honor bid to their skill total')
            .condition((context) => context.source.isParticipating())
            // read when the conflict resolves: a later bid (Regal Bearing, a duel) counts
            .playerLastingEffect({
                effect: changePlayerResolutionSkillModifier((player) => player.showBid)
            })
            .playerLastingEffect((context) => ({
                condition: (context) => !!context.player.opponent,
                target: context.player.opponent,
                effect: changePlayerResolutionSkillModifier((player) => player.showBid)
            }))
            .chatText('add the bid on each player\'s dial to their skill total during this conflict\'s resolution');
    }
}


export default DisguisedProtector;
