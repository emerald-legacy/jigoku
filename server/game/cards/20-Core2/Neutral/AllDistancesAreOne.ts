import { msg } from '../../../GameChat.js';
import { CardType, Location, Element } from '../../../Constants.js';
import { moveConflict, turnFacedown } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { captureCost } from '../../captureCost.js';

export default class AllDistancesAreOne extends DrawCard {
    static id = 'all-distances-are-one';

    setupCardAbilities() {
        this.action('Move conflict to a different province')
            .condition((context) =>
                !!(context.game.currentConflict
                    ?.getConflictProvinces()
                    .every((province) => province.location !== Location.StrongholdProvince && !province.isBroken) &&
                context.player.cardsInPlay.some(
                    (card) => card.isParticipating() && card.hasTrait('shugenja')
                )))
            .cost(captureCost('originalProvince', (context) => context.game.requireConflict().conflictProvince ?? undefined))
            .selectCard({
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: moveConflict(),
                message: (context, card) => msg`${context.player} moves the conflict to ${card}`
            })
            .chatText('move the conflict to another eligible province')
            .afterwardsIf((context) => !context.costs.originalProvince?.isBroken)
            .onAffinity(Element.Water, {
                activePromptTitle: 'Flip the original province facedown?',
                chatText: (context) => msg`flip ${context.costs.originalProvince} facedown`
            })
            .gameAction(turnFacedown((context) => ({ target: context.costs.originalProvince })));
    }
}
