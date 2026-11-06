import DrawCard from '../../DrawCard.js';
import { Players, Trait } from '../../Constants.js';
import { addKeyword, addTrait } from '../../effects.js';

class PhoenixTattoo extends DrawCard {
    static id = 'phoenix-tattoo';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: addTrait(Trait.Tattooed)
        });

        this.persistentEffect({
            targetController: Players.Any,
            condition: (context) => Boolean(context.source.parentCharacter && context.source.parentCharacter.isParticipating() && context.game.isDuringConflict()),
            match: (card, context) => card !== context?.source.parentCharacter && card.isParticipating(),
            effect: addKeyword('pride')
        });
    }
}


export default PhoenixTattoo;
