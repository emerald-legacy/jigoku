import { msg } from '../../../GameChat.js';
import { CardType, Location, Trait } from '../../../Constants.js';
import { moveConflict, turnFacedown } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { captureCost } from '../../captureCost.js';
import { controlsParticipating } from '../../controlsParticipating.js';

export default class AllDistancesAreOne extends DrawCard {
    static id = 'all-distances-are-one';

    override setupCardAbilities() {
        this.conflictAction('Move conflict to a different province')
            .ifCondition((context) =>
                !!(context.game.currentConflict
                    ?.getConflictProvinces()
                    .every((province) => province.location !== Location.StrongholdProvince && !province.isBroken) &&
                controlsParticipating(context.player, Trait.Shugenja)))
            .cost(captureCost('originalProvince', (context) => context.game.requireConflict().conflictProvince ?? undefined))
            .selectCard({
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: moveConflict(),
                message: (context, card) => msg`${context.player} moves the conflict to ${card}`
            })
            .chatText('move the conflict to another eligible province')
            .thenIf((context) => !context.costs.originalProvince?.isBroken)
            .onAffinity(Trait.Water, {
                activePromptTitle: 'Flip the original province facedown?',
                chatText: (context) => msg`flip ${context.costs.originalProvince} facedown`
            })
            .gameAction(turnFacedown((context) => ({ target: context.costs.originalProvince })));
    }
}
