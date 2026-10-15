import { msg } from '../../../GameChat.js';
import { CardType, ConflictType, Players, Trait } from '../../../Constants.js';
import { duelIgnorePrintedSkill, setMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroTechnique extends DrawCard {
    static id = 'shosuro-technique';

    setupCardAbilities() {
        this.duelChallenge('Apply status tokens to the duel', (duel, context) => duel.challengingPlayer && duel.challengingPlayer.opponent === context.player)
            .duelLastingEffect({
                effect: duelIgnorePrintedSkill()
            })
            .chatText('ignore printed skill when resolving this duel');

        this.conflictAction('Set shinobi\'s skills to that of an enemy', { conflictType: ConflictType.Military })
            .target({
                name: 'shinobi',
                activePromptTitle: 'Choose a Shinobi you control',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Shinobi) && card.isParticipating()
            })
            .target({
                name: 'enemy',
                dependsOn: 'shinobi',
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            })
            .cardLastingEffect((context) => ({
                target: context.targets.shinobi,
                effect: setMilitarySkill(context.targets.enemy.militarySkill)
            }))
            .chatText((context) => {
                const shinobi = context.targets.shinobi;
                const enemy = context.targets.enemy;
                return msg`set the ${'military'} of ${shinobi.name} to ${enemy.militarySkill}${'military'} (equal to ${enemy.name}). There's no blade as keen as surprise`;
            });
    }
}
