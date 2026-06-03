import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';
import { CardType } from '../../../Constants.js';

export default class AwakeTheFearfulHeart extends DrawCard {
    static id = 'awake-the-fearful-heart';

    setupCardAbilities() {
        this.action({
            title: 'Move home each character without fate',
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')
                ),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome((context) => ({
                    target:
                        (context.game.currentConflict as Conflict | null)?.getParticipants(
                            (character) => character.fate === 0
                        ) ?? []
                })),
                AbilityDsl.actions.onAffinity({
                    trait: 'air',
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.game.findAnyCardsInPlay(
                            (card: DrawCard) => card.getType() === CardType.Character
                        ),
                        effect: AbilityDsl.effects.cardCannot('moveToConflict')
                    })),
                    effect: 'forbid all players from moving characters into the conflict'
                })
            ])
        });
    }
}
