import { mustBeChosen } from '../../effects.js';
import { setHonorDial } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class SocialPuppeteer extends DrawCard {
    static id = 'social-puppeteer';

    setupCardAbilities() {
        this.composure({
            effect: mustBeChosen({ restricts: 'opponentsEvents' })
        });

        this.action('Switch honor dials with opponent')
            .condition((context) =>
                context.source.isParticipating() && !!context.player.opponent &&
                context.player.showBid !== context.player.opponent.showBid)
            .gameAction(setHonorDial((context) => ({ value: context.player.showBid })), setHonorDial((context) => ({
                target: context.player,
                value: context.player.opponent ? context.player.opponent.showBid : 0
            })))
            .chatText('switch honor dials with {1}', (context) => context.player.opponent);
    }
}


export default SocialPuppeteer;
