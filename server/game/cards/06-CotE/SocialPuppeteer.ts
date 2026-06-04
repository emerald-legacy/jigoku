import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

class SocialPuppeteer extends DrawCard {
    static id = 'social-puppeteer';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.mustBeChosen({ restricts: 'opponentsEvents' })
        });

        this.action({
            title: 'Switch honor dials with opponent',
            condition: (context: AbilityContext) =>
                (context.source as DrawCard).isParticipating() && !!context.player.opponent &&
                context.player.showBid !== context.player.opponent.showBid,
            effect: 'switch honor dials with {1}',
            effectArgs: (context: AbilityContext) => context.player.opponent as Player,
            gameAction: [
                AbilityDsl.actions.setHonorDial((context: AbilityContext) => ({ value: context.player.showBid })),
                AbilityDsl.actions.setHonorDial((context: AbilityContext) => ({
                    target: context.player,
                    value: context.player.opponent ? context.player.opponent.showBid : 0
                }))
            ]
        });
    }
}


export default SocialPuppeteer;
