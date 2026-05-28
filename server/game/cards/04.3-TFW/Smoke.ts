import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class Smoke extends DrawCard {
    static id = 'smoke';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Give non-unique characters -2/+0',
            condition: context => this.game.isDuringConflict() && context.source.parent && context.source.parent.isParticipating(),
            cost: [ability.costs.bowSelf(), ability.costs.sacrificeSelf()],
            gameAction: ability.actions.cardLastingEffect((context: any) => ({
                target: context.game.currentConflict?.getParticipants().filter((card: DrawCard) => !card.isUnique()) ?? [],
                effect: ability.effects.modifyMilitarySkill(-2)
            })),
            effect: 'give all non-unique participating characters -2{1}',
            effectArgs: () => ['military']
        });
    }
}


export default Smoke;
