import { msg } from '../../../GameChat.js';
import { DuelType } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class LetHimGoBy extends DrawCard {
    static id = 'let-him-go-by';

    public setupCardAbilities() {
        this.reaction('Bow a character')
            .when({
                onMoveToConflict: (event, context) =>
                    context.player.opponent && event.card.controller === context.player.opponent,
                onCardPlayed: (event, context) =>
                    context.player.opponent &&
                    event.card.controller === context.player.opponent &&
                    event.card.isParticipating()
            })
            .bow((context) => ({
                target: context.event.card
            }));

        this.action('Challenge a character anywhere to a duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                targetCondition: () => true,
                gameAction: (duel) =>
                    cardLastingEffect({
                        target: duel.winner,
                        effect: modifyMilitarySkill(
                            (duel.loser ?? []).reduce((total, card) => total + card.militarySkill, 0)
                        )
                    }),
                chatText: (_context, duel) => msg`${duel.winner} gets +${(duel.loser ?? []).reduce((total, card) => total + card.militarySkill, 0)}${'military'} skill`}))
            .max(perConflict(1));
    }
}
