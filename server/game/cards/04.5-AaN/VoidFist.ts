import { bow, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';

class VoidFist extends DrawCard {
    static id = 'void-fist';

    override setupCardAbilities() {
        this.action('Bow and send a character home')
            .condition(() => !!this.game.currentConflict)
            .ifCondition((context) => (this.game.currentConflict?.getNumberOfCardsPlayed(context.player) ?? 0) >= 2)
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && !!this.game.currentConflict && this.game.currentConflict.getCharacters(context.player).some((myCard) =>
                        myCard.hasTrait(Trait.Monk) && myCard.militarySkill >= card.militarySkill
                    )
            }, bow(), sendHome())
            .chatText('bow {0} and send them home');
    }
}


export default VoidFist;
