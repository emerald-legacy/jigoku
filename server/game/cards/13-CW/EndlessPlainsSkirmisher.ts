import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class EndlessPlainsSkirmisher extends DrawCard {
    static id = 'endless-plains-skirmisher';

    setupCardAbilities() {
        this.action('Move this character to the confict')
            .select('target', {
                targets: true,
                activePromptTitle: 'Which side should this character be on?'
            }, {
                [this.owner.name]: AbilityDsl.actions.moveToConflict({ side: this.owner }),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.moveToConflict({ side: this.owner.opponent })
            })
            .effect('join the conflict for {1}!', context => this.getEffectArg(context, context.select));
    }

    getEffectArg(context: AbilityContext, selection: string): Player | undefined {
        if(selection === context.player.name) {
            return context.player;
        }
        return context.player.opponent;
    }
}


export default EndlessPlainsSkirmisher;
