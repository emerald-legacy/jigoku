import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BackhandedCompliment2 extends DrawCard {
    static id = 'backhanded-compliment-2';

    setupCardAbilities() {
        this.action('Select a player to lose an honor and draw a card')
            .select('target', {
                targets: true
            }, Object.fromEntries(
                this.game
                    .getPlayers()
                    .map((target) => [
                        target.name,
                        AbilityDsl.actions.multiple([
                            AbilityDsl.actions.loseHonor({ target }),
                            AbilityDsl.actions.draw({ target })
                        ])
                    ])
            ))
            .effect('make {1} lose an honor and draw a card', (context) => (context.select === this.owner.name ? this.owner : this.owner.opponent));
    }
}
