import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { removeFate } from '../../GameActions/GameActions.js';

class SolitaryHero extends DrawCard {
    static id = 'solitary-hero';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action('Remove a fate from weaker military characters')
            .condition(context =>
                context.source.isParticipatingFor(context.player) &&
                (context.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0) === 1)
            .gameAction(removeFate((context) => ({
                target: context.game.currentConflict?.getParticipants((card) => card.getMilitarySkill() <= context.source.getMilitarySkill() && card !== context.source) ?? []
            })));
    }
}


export default SolitaryHero;
