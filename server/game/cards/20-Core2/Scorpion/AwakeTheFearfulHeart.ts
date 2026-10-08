import { cardCannot } from '../../../effects.js';
import { cardLastingEffect, onAffinity, sendHome, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';

export default class AwakeTheFearfulHeart extends DrawCard {
    static id = 'awake-the-fearful-heart';

    setupCardAbilities() {
        this.action('Move home each character without fate')
            .condition((context) =>
                context.player.cardsInPlay.some(
                    (card) => card.isParticipating() && card.hasTrait('shugenja')
                ))
            .gameAction(sequential([
                sendHome((context) => ({
                    target:
                        context.game.currentConflict?.getParticipants(
                            (character) => character.fate === 0
                        ) ?? []
                })),
                onAffinity({
                    trait: 'air',
                    gameAction: cardLastingEffect((context) => ({
                        target: context.game.findAnyCardsInPlay(
                            (card) => card.getType() === CardType.Character
                        ),
                        effect: cardCannot('moveToConflict')
                    })),
                    chatText: 'forbid all players from moving characters into the conflict'
                })
            ]));
    }
}
