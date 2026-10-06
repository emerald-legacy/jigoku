import {
    cannotBeDeclaredAsAttacker,
    cannotBeDeclaredAsDefender,
    modifyBothSkills,
    playerCannot
} from '../../../effects.js';
import { taint } from '../../../GameActions/GameActions.js';
import { CardType, Phases, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KuniJuurou extends DrawCard {
    static id = 'kuni-juurou';

    public setupCardAbilities() {
        this.controllerCannotPayHonorCostsEffect();

        this.persistentEffect({
            targetController: Players.Any,
            match: (card) => card.type === CardType.Character && (card.isTainted || card.hasTrait('shadowlands')),
            effect: modifyBothSkills(-2)
        });

        this.action('Taint a character')
            .condition((context) =>
                !!(context.player.opponent && context.player.hand.length <= context.player.opponent.hand.length))
            .target({
                cardType: CardType.Character
            }, taint())
            .effect('identify the source of Crab\'s misfortune… it is {0}! {0} is tainted')
            .phase(Phases.Conflict);
    }

    private controllerCannotPayHonorCostsEffect() {
        this.persistentEffect({
            effect: playerCannot({ cannot: 'loseHonor', restricts: 'loseHonorAsCost' })
        });

        /**
         * Shortcut to handle tainted characters.
         * Ideally it would be integrated when generating the conflict matrix etc.
         * Without this Tainted character get stopped from commiting into the conflict, but the declaration goes through
         */
        this.persistentEffect({
            match: (card) => card.controller === this.controller && card.isTainted,
            effect: cannotBeDeclaredAsAttacker()
        });
        this.persistentEffect({
            match: (card) => card.controller === this.controller && card.isTainted,
            effect: cannotBeDeclaredAsDefender()
        });
    }
}
