import AbilityDsl from '../../../abilitydsl.js';
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
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: this.getCharacters(context),
                effect: AbilityDsl.effects.cannotBeDeclaredAsDefender()
            })))
            .effect('prevent characters with less than 3{1} from defending (this affects {2})', (context) => ['military', this.getCharacters(context)]);
    }

    private getCharacters(context: AbilityContext) {
        return context.player.opponent?.cardsInPlay.filter(card => card.getMilitarySkill() < 3) ?? [];
    }
}
