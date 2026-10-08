import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, Duration, Players } from '../../../Constants.js';
import { duelIgnorePrintedSkill, setMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, duelLastingEffect, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroTechnique extends DrawCard {
    static id = 'shosuro-technique';

    setupCardAbilities() {
        this.duelChallenge('Apply status tokens to the duel', (duel, context) => duel.challengingPlayer && duel.challengingPlayer.opponent === context.player)
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: duelIgnorePrintedSkill(),
                duration: Duration.UntilEndOfDuel
            })))
            .chatText('ignore printed skill when resolving this duel');

        this.conflictAction('Set shinobi\'s skills to that of an enemy', { conflictType: ConflictType.Military })
            .target({
                name: 'shinobi',
                activePromptTitle: 'Choose a Shinobi you control',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi') && card.isParticipating()
            })
            .target({
                name: 'enemy',
                dependsOn: 'shinobi',
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            })
            .gameAction(multiple([
                cardLastingEffect((context) => ({
                    target: context.targets.shinobi,
                    effect: setMilitarySkill(context.targets.enemy.militarySkill)
                }))
            ]))
            .chatText((context) => {
                const shinobi = context.targets.shinobi;
                const enemy = context.targets.enemy;
                return msg`set the ${'military'} of ${shinobi.name} to ${enemy.militarySkill}${'military'} (equal to ${enemy.name}). There's no blade as keen as surprise`;
            });
    }
}
