import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { dishonor } from '../../GameActions/GameActions.js';

class MagistratesIntervention extends DrawCard {
    static id = 'magistrate-s-intervention';

    override setupCardAbilities() {
        this.action('Dishonor a character')
            .playOnlyIf((context) => context.player.cardsInPlay.some((card) => card.type === CardType.Character && (card.hasTrait(Trait.Courtier) || card.hasTrait(Trait.Magistrate))))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, dishonor())
            .chatText((context) => msg`dishonor ${context.chatTarget()}${context.player.opponent && context.target?.controller === context.player.opponent && context.game.getDeclaredConflictCount(context.player.opponent) > 1 ? ', then dishonor it again' : ''}`)
            .thenIf((context) => !!(
                context.player.opponent && context.target?.controller === context.player.opponent &&
                    context.game.getDeclaredConflictCount(context.player.opponent) > 1))
            .dishonor((context) => ({ target: context.target }));
    }
}

export default MagistratesIntervention;
