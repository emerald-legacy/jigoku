import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { moveToConflict, sendHome } from '../../GameActions/GameActions.js';

class AkodoReserveCompany extends DrawCard {
    static id = 'akodo-reserve-company';

    override setupCardAbilities() {
        this.action('Bow an attacking character')
            .ifCondition((context) => context.game.isTraitInPlay(Trait.Battlefield))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.controller === context.player && sendHome().canAffect(card, context) &&
                    moveToConflict().canAffect(context.source, context)
            })
            .moveToConflict((context) => ({ target: context.source }))
            .chatText((context) => msg`move ${context.source} into the conflict and send ${context.target} home`)
            .then()
            .sendHome((context) => ({ target: context.target }));
    }
}


export default AkodoReserveCompany;
