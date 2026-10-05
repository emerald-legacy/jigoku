import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class UjikTactics extends DrawCard {
    static id = 'ujik-tactics';

    setupCardAbilities() {
        this.action('Give each non-unique character +1 military during this conflict')
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter((card) => !card.isUnique()),
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            })))
            .effect('give all non-unique character they control +1{1}', () => (['military']));
    }
}


export default UjikTactics;
