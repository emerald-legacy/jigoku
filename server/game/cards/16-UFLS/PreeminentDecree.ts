import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class PreeminentDecree extends DrawCard {
    static id = 'preeminent-decree';

    setupCardAbilities() {
        this.conflictAction('Give all participating characters a political penalty')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => {
                    return card.hasTrait('courtier') && card.isParticipating() && card.glory > 0;
                }
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((a) => a !== context.target) ?? [],
                effect: AbilityDsl.effects.modifyPoliticalSkill(-1 * ((context.target && context.target.glory) || 0))
            })))
            .effect('give all participating characters except {0} -{1}{2}', context => [context.target.glory, 'political']);
    }
}


export default PreeminentDecree;
