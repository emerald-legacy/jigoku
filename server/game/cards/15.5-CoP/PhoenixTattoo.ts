import DrawCard from '../../DrawCard.js';
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
            condition: (context) => Boolean(context.source.parentCharacter && context.source.parentCharacter.isParticipating() && context.game.isDuringConflict()),
            match: (card, context) => card !== context?.source.parentCharacter && card.isParticipating(),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}


export default PhoenixTattoo;
