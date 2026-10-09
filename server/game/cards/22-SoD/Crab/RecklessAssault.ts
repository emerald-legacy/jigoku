import { msg } from '../../../GameChat.js';
import { cannotBeDeclaredAsDefender } from '../../../effects.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { attacksAloneWithTrait } from '../../attacksAlone.js';

export default class RecklessAssault extends DrawCard {
    static id = 'reckless-assault';

    setupCardAbilities() {
        this.reaction('Force defenders')
            .when({
                onConflictDeclared: (event, context) => attacksAloneWithTrait(event.conflict, context.player, 'berserker')
            })
            .cardLastingEffect((context) => ({
                target: this.getCharacters(context),
                effect: cannotBeDeclaredAsDefender()
            }))
            .chatText((context) => msg`prevent characters with less than 3${'military'} from defending (this affects ${this.getCharacters(context)})`);
    }

    private getCharacters(context: AbilityContext) {
        return context.player.opponent?.cardsInPlay.filter((card) => card.militarySkill < 3) ?? [];
    }
}
