import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class PhoenixTattoo extends DrawCard {
    static id = 'phoenix-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.persistentEffect({
            targetController: Players.Any,
            condition: (context: AbilityContext) => Boolean(context.source.parent && context.source.parent.isParticipating() && context.game.isDuringConflict()),
            match: (card: any, context: any) => card !== context?.source.parent && card.isParticipating(),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}


export default PhoenixTattoo;
