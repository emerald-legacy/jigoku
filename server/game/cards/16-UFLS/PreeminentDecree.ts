import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class PreeminentDecree extends DrawCard {
    static id = 'preeminent-decree';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Give all participating characters a political penalty',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => {
                    return card.hasTrait('courtier') && card.isParticipating() && card.glory > 0;
                },
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>(context => ({
                    target: context.game.currentConflict?.getParticipants().filter((a: any) => a !== context.target) ?? [],
                    effect: AbilityDsl.effects.modifyPoliticalSkill(-1 * ((context.target && context.target.glory) || 0))
                }))
            },
            effect: 'give all participating characters except {0} -{1}{2}',
            effectArgs: context => [context.target?.glory ?? 0, 'political']
        });
    }
}


export default PreeminentDecree;
