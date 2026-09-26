import { CardType, ConflictType, Duration, Players } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroTechnique extends DrawCard {
    static id = 'shosuro-technique';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Apply status tokens to the duel',
            duelCondition: (duel, context) => duel.challengingPlayer && duel.challengingPlayer.opponent === context.player,
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.duel,
                effect: AbilityDsl.effects.duelIgnorePrintedSkill(),
                duration: Duration.UntilEndOfDuel
            })),
            effect: 'ignore printed skill when resolving this duel'
        });

        this.action('Set shinobi\'s skills to that of an enemy')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target('shinobi', {
                activePromptTitle: 'Choose a Shinobi you control',
                cardType: CardType.Character,
                controller: Players.Self,
                optional: false,
                cardCondition: (card) => card.hasTrait('shinobi') && card.isParticipating()
            })
            .target('enemy', {
                dependsOn: 'shinobi',
                controller: Players.Opponent,
                cardType: CardType.Character,
                optional: false,
                cardCondition: (card) => card.isParticipating()
            })
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Duration.UntilEndOfConflict,
                    target: context.targets.shinobi,
                    effect: AbilityDsl.effects.setMilitarySkill(context.targets.enemy.militarySkill)
                }))
            ]))
            .effect('set the {3} of {1} to {4}{3} (equal to {2}). There\'s no blade as keen as surprise.', (context) => {
                const shinobi = context.targets.shinobi;
                const enemy = context.targets.enemy;
                return [shinobi.name, enemy.name, 'military', enemy.militarySkill];
            });
    }
}
