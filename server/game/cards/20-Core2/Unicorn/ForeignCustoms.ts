import { msg } from '../../../GameChat.js';
import { CardType, Location, Players, Trait, EntersPlayStatus } from '../../../Constants.js';
import { putIntoConflict, ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsClanCard } from '../../controlsClanCard.js';

export default class ForeignCustoms extends DrawCard {
    static id = 'foreign-customs';

    override setupCardAbilities() {
        this.duelStrike('Put a character into play', (duel, context) => duel.loserController === context.player)
            .selectCard({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                message: (context, cards) => msg`${context.player} puts into the conflict ${cards} - they challenge the traditions of the empire`,
                gameAction: putIntoConflict({ status: EntersPlayStatus.Dishonored })
            });

        this.action('Ready a non-unicorn character')
            .ifCondition((context) => controlsClanCard(context.player, 'unicorn'))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAtHome() && (!card.isFaction('unicorn') || card.hasTrait(Trait.Gaijin))
            }, ready());
    }
}
