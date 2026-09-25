import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class SocialPuppeteer extends DrawCard {
    static id = 'social-puppeteer';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.mustBeChosen({ restricts: 'opponentsEvents' })
        });

        this.action('Switch honor dials with opponent')
            .condition((context) =>
                context.source.isParticipating() && !!context.player.opponent &&
                context.player.showBid !== context.player.opponent.showBid)
            .gameAction(AbilityDsl.actions.setHonorDial((context) => ({ value: context.player.showBid })), AbilityDsl.actions.setHonorDial((context) => ({
                target: context.player,
                value: context.player.opponent ? context.player.opponent.showBid : 0
            })))
            .effect('switch honor dials with {1}', (context) => context.player.opponent);
    }
}


export default SocialPuppeteer;
