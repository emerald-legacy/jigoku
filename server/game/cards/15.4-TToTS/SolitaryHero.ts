import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class SolitaryHero extends DrawCard {
    static id = 'solitary-hero';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({
                cannot: RestrictionType.ApplyCovert,
                appliesTo: RestrictionScope.OpponentsCardEffects
            })
        });

        this.action('Remove a fate from weaker military characters')
            .condition((context) =>
                context.source.isParticipatingFor(context.player) &&
                (context.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0) === 1)
            .removeFate((context) => ({
                target: context.game.currentConflict?.getParticipants((card) => card.militarySkill <= context.source.militarySkill && card !== context.source) ?? []
            }));
    }
}


export default SolitaryHero;
