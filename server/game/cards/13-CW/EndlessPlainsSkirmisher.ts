import DrawCard from '../../DrawCard.js';
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
            .effect('join the conflict for {1}!', (context) => context.select === context.player.name ? context.player : context.player.opponent);
    }
}


export default EndlessPlainsSkirmisher;
