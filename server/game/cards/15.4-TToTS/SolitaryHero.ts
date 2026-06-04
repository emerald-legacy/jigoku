import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SolitaryHero extends DrawCard {
    static id = 'solitary-hero';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action({
            title: 'Remove a fate from weaker military characters',
            condition: context =>
                context.source.isParticipatingFor(context.player) &&
                (context.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0) === 1,
            gameAction: AbilityDsl.actions.removeFate(context => ({
                target: context.game.currentConflict?.getParticipants((card: DrawCard) => card.getMilitarySkill() <= (context.source as DrawCard).getMilitarySkill() && card !== context.source) ?? [],
                amount: 1
            }))
        });
    }
}


export default SolitaryHero;
