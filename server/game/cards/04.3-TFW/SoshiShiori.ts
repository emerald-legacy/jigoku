import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class SoshiShiori extends DrawCard {
    static id = 'soshi-shiori';

    setupCardAbilities() {
        this.reaction('Make opponent lose 1 honor')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player
            })
            .select('target', {
                activePromptTitle: 'Choose a player to lose 1 honor',
                targets: true
            }, {
                [this.owner.name]: AbilityDsl.actions.loseHonor({ target: this.owner }),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.loseHonor({ target: this.owner.opponent })
            })
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}

export default SoshiShiori;
