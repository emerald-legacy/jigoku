import { Location, Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class InquisitorialInitiate extends DrawCard {
    static id = 'inquisitorial-initiate';

    public setupCardAbilities() {
        this.reaction('Discard an opponent\'s card')
            .when({
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            })
            .targetCards({
                activePromptTitle: 'Choose cards to reveal',
                player: Players.Opponent,
                numCardsFunc: (context) =>
                    context.player.opponent?.cardsInPlay.filter((card) => card.getFate() === 0).length ?? 0,
                mode: TargetMode.ExactlyVariable,
                location: Location.Hand
            })
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.lookAt((context) => ({
                    target: context.targets.target
                })),
                AbilityDsl.actions.cardMenu((context) => ({
                    cards: context.targets.target.filter((card) => card.isDrawCard()),
                    gameAction: AbilityDsl.actions.discardCard(),
                    message: '{0} chooses {1} to be discarded',
                    messageArgs: (card, player) => [player, card]
                }))
            ]));
    }
}
