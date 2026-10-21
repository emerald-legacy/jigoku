import { modifyMilitarySkill } from '../../effects.js';
import { sendHome } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

// Shiksha Scout's additional character counts
function participatingCharacters(player: Player): number {
    return player.game.currentConflict?.getNumberOfParticipantsFor(player) ?? 0;
}

export default class ChallengeOnTheFields extends DrawCard {
    static id = 'challenge-on-the-fields';

    override setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel((context) => ({
                type: DuelType.Military,
                statistic: (card, duelRules) =>
                    duelRules === 'printedSkill'
                        ? card.printedMilitarySkill + participatingCharacters(card.controller) - 1
                        : card.militarySkill,
                challengerEffect: modifyMilitarySkill(participatingCharacters(context.player) - 1),
                targetEffect: modifyMilitarySkill(
                    context.player.opponent ? participatingCharacters(context.player.opponent) - 1 : 0
                ),
                gameAction: (duel) => sendHome({ target: duel.loser })
            }));
    }
}
