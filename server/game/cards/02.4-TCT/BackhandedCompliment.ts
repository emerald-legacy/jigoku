import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class BackhandedCompliment extends DrawCard {
    static id = 'backhanded-compliment';

    setupCardAbilities() {
        this.action('Select a player to lose an honor and draw a card')
            .select('target', {
                targets: true
            }, {
                [this.owner.name]: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.loseHonor({ target: this.owner }),
                    AbilityDsl.actions.draw({ target: this.owner })
                ]),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.loseHonor({ target: this.owner.opponent }),
                    AbilityDsl.actions.draw({ target: this.owner.opponent })
                ])
            })
            .effect('make {1} lose an honor and draw a card', context => context.select === this.owner.name ? this.owner : (this.owner.opponent ?? ''));
    }
}


export default BackhandedCompliment;
