import { msg } from '../../../GameChat.js';
import { cardCannot } from '../../../effects.js';
import { cardLastingEffect, onAffinity, sendHome, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, RestrictionType, Trait } from '../../../Constants.js';
import { controlsParticipating } from '../../controlsParticipating.js';

export default class AwakeTheFearfulHeart extends DrawCard {
    static id = 'awake-the-fearful-heart';

    override setupCardAbilities() {
        this.conflictAction('Move home each character without fate')
            .ifCondition((context) => controlsParticipating(context.player, Trait.Shugenja))
            .gameAction(sequential([
                sendHome((context) => ({
                    target:
                        context.game.currentConflict?.getParticipants(
                            (character) => character.fate === 0
                        ) ?? []
                })),
                onAffinity({
                    trait: Trait.Air,
                    gameAction: cardLastingEffect((context) => ({
                        target: context.game.findAnyCardsInPlay(
                            (card) => card.type === CardType.Character
                        ),
                        effect: cardCannot(RestrictionType.MoveToConflict)
                    })),
                    chatText: () => msg`forbid all players from moving characters into the conflict`
                })
            ]));
    }
}
