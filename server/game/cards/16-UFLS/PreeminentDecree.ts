import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

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
            }, cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getParticipants().filter((a) => a !== context.target) ?? [],
                effect: modifyPoliticalSkill(-1 * ((context.target && context.target.glory) || 0))
            })))
            .chatText((context) => msg`give all participating characters except ${context.chatTarget()} -${context.target.glory}${'political'}`);
    }
}


export default PreeminentDecree;
