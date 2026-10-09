import { msg } from '../../GameChat.js';
import { mustBeChosen } from '../../effects.js';
import { setHonorDial } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { RestrictionScope } from '../../Constants.js';

class SocialPuppeteer extends DrawCard {
    static id = 'social-puppeteer';

    setupCardAbilities() {
        this.composure({
            effect: mustBeChosen({ appliesTo: RestrictionScope.OpponentsEvents })
        });

        this.action('Switch honor dials with opponent')
            .condition((context) =>
                context.source.isParticipating() && !!context.player.opponent &&
                context.player.showBid !== context.player.opponent.showBid)
            .gameAction(setHonorDial((context) => ({ value: context.player.showBid })), setHonorDial((context) => ({
                target: context.player,
                value: context.player.opponent ? context.player.opponent.showBid : 0
            })))
            .chatText((context) => msg`switch honor dials with ${context.player.opponent}`);
    }
}


export default SocialPuppeteer;
