import { msg, type MessageArgs } from './GameChat.js';
import * as Settings from '../settings.js';
import { CardType, type ConflictType, EffectName, type Element, EventName, favorAppliesTo, Location, RestrictionType } from './Constants.js';
import { GameObject } from './GameObject.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type BaseCard from './BaseCard.js';
import type Game from './Game.js';
import Player from './Player.js';
import type Ring from './Ring.js';
import type DrawCard from './DrawCard.js';
import { bow } from './GameActions/GameActions.js';
import { takeAllFateFromRing } from './GameActions/TakeFateFromRingAction.js';

type Predicate = (card: DrawCard) => boolean;

export class Conflict extends GameObject {
    #attackerCardsPlayed = new Set<DrawCard>();
    #attackers = new Set<DrawCard>();
    #attackersCache: DrawCard[] | null = null;
    #declarationComplete = false;
    #defenderCardsPlayed = new Set<DrawCard>();
    #defenders = new Set<DrawCard>();
    #defendersCache: DrawCard[] | null = null;
    attackerDeclarationFailed = false;
    attackerSkill = 0;
    conflictFailedToInitiate = false;
    defenderDeclarationFailed = false;
    conflictPassed = false;
    conflictTypeSwitched = false;
    conflictUnopposed = false;
    declaredProvince: ProvinceCard | null = null;
    declaredRing?: Ring;
    declaredType: ConflictType | null = null;
    defendersChosen = false;
    defenderSkill = 0;
    defendingPlayer: Player;
    isSinglePlayer: boolean;
    loser?: Player;
    loserSkill?: number;
    /** The provinces broken while this conflict was the current one. */
    brokenProvinces: ProvinceCard[] = [];
    attackersAtResolution: DrawCard[] = [];
    /** The attackers and defenders as the conflict finished resolving, before they returned home: one sent home earlier (False Loyalties) isn't among them. */
    attackersAtEnd: DrawCard[] = [];
    defendersAtEnd: DrawCard[] = [];
    defendersAtResolution: DrawCard[] = [];
    provinceStrengthsAtResolution: Array<{ province: ProvinceCard; strength: number }> = [];
    skillDifference?: number;
    winner?: Player;
    winnerDetermined = false;
    winnerSkill?: number;
    conflictProvince?: ProvinceCard | null;

    constructor(
        game: Game,
        public attackingPlayer: Player,
        defendingPlayer: Player | undefined,
        public ring?: Ring,
        conflictProvince?: ProvinceCard,
        public forcedDeclaredType?: ConflictType
    ) {
        super(game, 'Conflict');
        this.isSinglePlayer = !defendingPlayer;
        this.defendingPlayer = defendingPlayer || this.singlePlayerDefender();
        this.conflictProvince = conflictProvince;
        this.declaredRing = ring;
        this.declaredProvince = conflictProvince ?? null;
    }

    get attackers() {
        if(!this.#attackersCache) {
            this.#attackersCache = Array.from(this.#attackers);
        }
        return this.#attackersCache;
    }

    set attackers(characters: DrawCard[]) {
        this.#attackers = new Set(characters);
        this.#attackersCache = null;
    }

    get defenders() {
        if(!this.#defendersCache) {
            this.#defendersCache = Array.from(this.#defenders);
        }
        return this.#defendersCache;
    }

    set defenders(characters: DrawCard[]) {
        this.#defenders = new Set(characters);
        this.#defendersCache = null;
    }

    getConflictProvinces(): ProvinceCard[] {
        if(!this.conflictProvince) {
            return [];
        }

        const additionalProvinces = this.getEffects(EffectName.AdditionalAttackedProvince);
        additionalProvinces.unshift(this.conflictProvince);
        return additionalProvinces;
    }

    isCardInConflictProvince(card: BaseCard): boolean {
        return this.getConflictProvinces().some(
            (a) => a.location === card.location && a.controller === card.controller
        );
    }

    get conflictType(): undefined | ConflictType {
        return this.ring?.conflictType;
    }

    get element(): undefined | Element {
        return this.ring?.element;
    }

    get maxAllowedDefenders() {
        const defenderCountRestrictions = this.getEffects(EffectName.RestrictNumberOfDefenders);
        return defenderCountRestrictions.length === 0 ? -1 : Math.min(...defenderCountRestrictions);
    }

    getSummary() {
        const effects = this.getEffects(EffectName.ForceConflictUnopposed);
        const forcedUnopposed = effects.length !== 0;
        // whether the attacker would win and break, counting what is added during resolution
        const { attackerSkill, defenderSkill } = this.getResolutionSkills();
        return {
            attackingPlayerId: this.attackingPlayer.id,
            defendingPlayerId: this.defendingPlayer.id,
            attackerSkill: this.attackerSkill,
            defenderSkill: this.defenderSkill,
            type: this.conflictType,
            elements: this.elements,
            attackerWins: this.#attackers.size > 0 && attackerSkill >= defenderSkill,
            breaking:
                this.conflictProvince &&
                this.getConflictProvinces().some(
                    (p) => p.getStrength() - (attackerSkill - defenderSkill) <= 0
                ),
            unopposed: !(this.#defenders && this.#defenders.size > 0 && !forcedUnopposed),
            declarationComplete: this.#declarationComplete,
            defendersChosen: this.defendersChosen
        };
    }

    setDeclarationComplete(value: boolean) {
        this.#declarationComplete = value;
    }

    setDefendersChosen(value: boolean) {
        this.defendersChosen = value;
    }

    private singlePlayerDefender() {
        const dummyPlayer = new Player(
            '',
            Settings.getUserWithDefaultsSet({ username: 'Dummy Player' }),
            false,
            this.game
        );
        dummyPlayer.initialise();
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForConflict();
        this.defendingPlayer.resetForConflict();
        this.getConflictProvinces().forEach((a) => (a.inConflict = false));
    }

    addAttackers(attackers: DrawCard[]): void {
        for(const attacker of attackers) {
            this.addAttacker(attacker);
        }
    }

    addAttacker(attacker: DrawCard): void {
        attacker.inConflict = true;
        this.#attackers.add(attacker);
        this.#attackersCache = null;
    }

    addDefenders(defenders: DrawCard[]): void {
        for(const defender of defenders) {
            this.addDefender(defender);
        }
    }

    addDefender(defender: DrawCard): void {
        defender.inConflict = true;
        this.#defenders.add(defender);
        this.#defendersCache = null;
    }

    hasElement(element: Element) {
        return this.elements.includes(element);
    }

    get elements(): Array<'air' | 'earth' | 'fire' | 'void' | 'water'> {
        return this.ring ? this.ring.getElements() : [];
    }

    get elementsToResolve() {
        return this.sumEffects(EffectName.ModifyConflictElementsToResolve) + 1;
    }

    switchType() {
        if(!this.ring) {
            return;
        }
        this.ring.flipConflictType();
        this.conflictTypeSwitched = true;
    }

    switchElement(element: Element) {
        const newRing = this.game.rings[element];
        if(!newRing) {
            throw new Error('switchElement called for non-existant element');
        }
        this.game.openThenEventWindow(takeAllFateFromRing(newRing, this.game.getFrameworkContext(this.attackingPlayer)));
        if(newRing.conflictType !== this.conflictType) {
            newRing.flipConflictType();
        }
        if(this.ring) {
            if(newRing.isClaimed()) {
                const claimedPlayer = this.game.getPlayers().find((player) => newRing.claimedBy === player.name);
                if(claimedPlayer) {
                    this.ring.claimRing(claimedPlayer);
                }
                newRing.resetRing();
            } else {
                this.ring.resetRing();
            }
        }
        newRing.contested = true;
        this.ring = newRing;
    }

    /** RRG Dash / Participating: such a character is removed from the conflict and placed at home bowed, a rule that "cannot be moved home" doesn't stop. */
    checkForIllegalParticipants() {
        const illegal = [
            ...this.getAttackers().filter((card) => !card.canParticipateAsAttacker(this.conflictType)),
            ...this.getDefenders().filter((card) => !card.canParticipateAsDefender(this.conflictType))
        ];
        if(illegal.length > 0) {
            this.game.addMessage(msg`${illegal} cannot participate in the conflict any more and ${illegal.length > 1 ? 'are' : 'is'} sent home bowed`);
            illegal.forEach((card) => this.removeFromConflict(card));
            this.game.resolveActions([bow({ target: illegal })], this.game.getFrameworkContext(this.game.getPlayersInFirstPlayerOrder()[0]));
        }
    }

    removeFromConflict(card: DrawCard): void {
        card.inConflict = false;
        if(this.#attackers.delete(card)) {
            this.#attackersCache = null;
        } else if(this.#defenders.delete(card)) {
            this.#defendersCache = null;
        }
    }

    isAttacking(card: DrawCard) {
        return this.#attackers.has(card) || (
            card.anyEffect(EffectName.ParticipatesFromHome) &&
            card.canParticipateAsAttacker(this.conflictType) &&
            card.isAtHome() &&
            card.controller === this.attackingPlayer
        );
    }

    isDefending(card: DrawCard) {
        return this.#defenders.has(card) || (
            card.anyEffect(EffectName.ParticipatesFromHome) &&
            card.canParticipateAsDefender(this.conflictType) &&
            card.isAtHome() &&
            card.controller === this.defendingPlayer
        );
    }

    isParticipating(card: DrawCard): boolean {
        return (this.isAttacking(card) || this.isDefending(card)) && this.#declarationComplete;
    }

    getAttackers(predicate?: Predicate): DrawCard[] {
        const attackersArray: DrawCard[] = [];
        for(const attacker of this.#attackers) {
            if(!predicate || predicate(attacker)) {
                attackersArray.push(attacker);
            }
        }

        for(const card of this.attackingPlayer.cardsInPlay) {
            if(
                card.anyEffect(EffectName.ParticipatesFromHome) &&
                card.canParticipateAsAttacker(this.conflictType) &&
                card.isAtHome() &&
                (!predicate || predicate(card))
            ) {
                attackersArray.push(card);
            }
        }
        return attackersArray;
    }

    getDefenders(predicate?: Predicate): DrawCard[] {
        const defendersArray: DrawCard[] = [];
        for(const defender of this.#defenders) {
            if(!predicate || predicate(defender)) {
                defendersArray.push(defender);
            }
        }
        for(const card of this.defendingPlayer.cardsInPlay) {
            if(
                card.anyEffect(EffectName.ParticipatesFromHome) &&
                card.canParticipateAsDefender(this.conflictType) &&
                card.isAtHome() &&
                (!predicate || predicate(card))
            ) {
                defendersArray.push(card);
            }
        }
        return defendersArray;
    }

    getParticipants(predicate?: Predicate) {
        const participants = this.getAttackers().concat(this.getDefenders());
        return typeof predicate === 'function' ? participants.filter(predicate) : participants;
    }

    getNumberOfParticipants(predicate: Predicate): number {
        return this.getParticipants().reduce((count, card) => (predicate(card) ? count + 1 : count), 0);
    }

    getNumberOfParticipantsFor(player?: Player | 'attacker' | 'defender', predicate?: Predicate) {
        let _player: undefined | Player;
        if(player === 'attacker' || player === this.attackingPlayer) {
            _player = this.attackingPlayer;
        } else if(player === 'defender' || player === this.defendingPlayer) {
            _player = this.defendingPlayer;
        }
        if(!_player) {
            return 0;
        }

        const characters = this.getCharacters(_player);
        if(predicate) {
            return characters.filter(predicate).length;
        }
        return characters.length + _player.sumEffects(EffectName.AdditionalCharactersInConflict);
    }

    hasMoreParticipants(player: Player | undefined, predicate: Predicate = () => true) {
        if(!player) {
            return false;
        }
        if(!player.opponent) {
            return !!this.getNumberOfParticipantsFor(player, predicate);
        }
        return this.getNumberOfParticipantsFor(player) > this.getNumberOfParticipantsFor(player.opponent);
    }

    addCardPlayed(player: Player, card: DrawCard) {
        if(player === this.attackingPlayer) {
            this.#attackerCardsPlayed.add(card.createSnapshot());
        } else {
            this.#defenderCardsPlayed.add(card.createSnapshot());
        }
    }

    getCardsPlayed(player: Player, predicate?: Predicate): DrawCard[] {
        const cardsPlayed: DrawCard[] = [];
        for(const card of player === this.attackingPlayer ? this.#attackerCardsPlayed : this.#defenderCardsPlayed) {
            if(typeof predicate !== 'function' || predicate(card)) {
                cardsPlayed.push(card);
            }
        }
        return cardsPlayed;
    }

    getNumberOfCardsPlayed(player: Player, predicate?: Predicate) {
        if(!player) {
            return 0;
        }
        if(predicate) {
            return this.getCardsPlayed(player, predicate).length;
        }
        return player.sumEffects(EffectName.AdditionalCardPlayed) + this.getCardsPlayed(player).length;
    }

    /** `atResolution`: when the winner is determined, which also counts the skill added "during this conflict's resolution" (Disguised Protector). */
    calculateSkill(prevStateChanged = false, atResolution = false) {
        const stateChanged = this.game.effectEngine.checkEffects(prevStateChanged);

        if(this.winnerDetermined) {
            return stateChanged;
        }

        const setAttackerSkill = this.attackingPlayer.mostRecentEffect(EffectName.SetConflictTotalSkill);
        if(setAttackerSkill !== undefined) {
            this.attackerSkill = setAttackerSkill;
        } else {
            this.attackerSkill =
                this.calculateSkillFor(this.getAttackers().concat(this.getAdditionalContributors(this.attackingPlayer))) +
                this.attackingPlayer.skillModifier + (atResolution ? this.resolutionBonus(this.attackingPlayer) : 0);
            if(favorAppliesTo(this.attackingPlayer.imperialFavor, this.conflictType) && this.#attackers.size > 0) {
                this.attackerSkill++;
            }
        }

        const setDefenderSkill = this.defendingPlayer.mostRecentEffect(EffectName.SetConflictTotalSkill);
        if(setDefenderSkill !== undefined) {
            this.defenderSkill = setDefenderSkill;
        } else {
            this.defenderSkill =
                this.calculateSkillFor(this.getDefenders().concat(this.getAdditionalContributors(this.defendingPlayer))) +
                this.defendingPlayer.skillModifier + (atResolution ? this.resolutionBonus(this.defendingPlayer) : 0);
            if(favorAppliesTo(this.defendingPlayer.imperialFavor, this.conflictType) && this.#defenders.size > 0) {
                this.defenderSkill++;
            }
        }

        return stateChanged;
    }

    /**
     * A player's current skill of a type (RRG "Current"): the conflict total for the conflict's type. For the other
     * type, the skill of that type of each character that would count, without the conflict's skill modifiers.
     */
    getCurrentSkill(player: Player, type: ConflictType): number {
        const isAttacker = player === this.attackingPlayer;
        if(type === this.conflictType) {
            return isAttacker ? this.attackerSkill : this.defenderSkill;
        }
        const cards = (isAttacker ? this.getAttackers() : this.getDefenders()).concat(this.getAdditionalContributors(player));
        return this.calculateSkillFor(cards, (card) => card.getSkill(type));
    }

    private getAdditionalContributors(player: Player): DrawCard[] {
        const contributingLocations = [Location.PlayArea, ...this.game.getProvinceArray()];
        return this.game.findAnyCardsInAnyList(
            (card): card is DrawCard =>
                card.isDrawCard() &&
                card.type === CardType.Character &&
                contributingLocations.includes(card.location) &&
                card.getEffects(EffectName.ContributeToConflict).some((value) => value === player)
        );
    }

    calculateSkillFor(cards: DrawCard[], fixedSkillFunction?: (card: DrawCard) => number) {
        let skillFunction =
            fixedSkillFunction ??
            (this.mostRecentEffect(EffectName.ChangeConflictSkillFunction) ||
                ((card: DrawCard) => card.getContributionToConflict(this.conflictType)));
        const cannotContributeFunctions = this.getEffects(EffectName.CannotContribute);

        return cards.reduce((sum, card) => {
            const canContributeWhileBowed = card.anyEffect(EffectName.CanContributeWhileBowed);
            let cannotContribute = card.bowed && !canContributeWhileBowed;
            const playerSkillFunction = fixedSkillFunction ? undefined : card.controller.mostRecentEffect(EffectName.ChangeConflictSkillFunction);
            if(playerSkillFunction) {
                skillFunction = playerSkillFunction;
            }
            if(!cannotContribute) {
                cannotContribute = cannotContributeFunctions.some((func) => func(card));
            }
            if(!cannotContribute) {
                cannotContribute = !card.checkRestrictions(
                    RestrictionType.ContributeSkillToConflictResolution,
                    this.game.getFrameworkContext(card.controller)
                );
            }
            if(cannotContribute) {
                return sum;
            }
            return sum + skillFunction(card, this);
        }, 0);
    }

    determineWinner() {
        this.calculateSkill(false, true);
        this.winnerDetermined = true;
        this.attackersAtResolution = this.getAttackers().slice();
        this.defendersAtResolution = this.getDefenders().slice();
        this.provinceStrengthsAtResolution = [];
        this.getConflictProvinces()
            .filter((a) => a)
            .forEach((a) => {
                this.provinceStrengthsAtResolution.push({
                    province: a,
                    strength: a.getStrength()
                });
            });

        const winner = this.getWinningPlayer();
        if(!winner) {
            this.loser = undefined;
            this.winner = undefined;
            this.loserSkill = this.winnerSkill = 0;
            this.skillDifference = 0;
            return;
        }
        const attackerWon = winner === this.attackingPlayer;
        this.winner = winner;
        this.loser = attackerWon ? this.defendingPlayer : this.attackingPlayer;
        this.winnerSkill = attackerWon ? this.attackerSkill : this.defenderSkill;
        this.loserSkill = attackerWon ? this.defenderSkill : this.attackerSkill;
        this.skillDifference = Math.max(0, this.winnerSkill - this.loserSkill);
    }

    /** Skill `player`'s side adds during this conflict's resolution (Disguised Protector), as it stands now; none while its total is set. */
    resolutionBonus(player: Player): number {
        return player.mostRecentEffect(EffectName.SetConflictTotalSkill) !== undefined || this.winnerDetermined ? 0 : player.resolutionSkillModifier;
    }

    /** The totals the conflict would resolve with now: the current totals plus what is added during resolution. */
    getResolutionSkills(): { attackerSkill: number; defenderSkill: number } {
        return {
            attackerSkill: this.attackerSkill + this.resolutionBonus(this.attackingPlayer),
            defenderSkill: this.defenderSkill + this.resolutionBonus(this.defendingPlayer)
        };
    }

    /** Who wins with these totals (the current ones by default). RRG "Winning a Conflict": a side needs at least 1 skill and a participating character; a tie goes to the attacker. */
    getWinningPlayer(attackerSkill = this.attackerSkill, defenderSkill = this.defenderSkill): Player | undefined {
        const attackerCanWin = attackerSkill > 0 && this.getAttackers().length > 0;
        const defenderCanWin = defenderSkill > 0 && this.getDefenders().length > 0;
        if(attackerCanWin && (!defenderCanWin || attackerSkill >= defenderSkill)) {
            return this.attackingPlayer;
        }
        return defenderCanWin ? this.defendingPlayer : undefined;
    }

    /** "this character wins the conflict" (RRG Winning a Conflict): it participates on the winning side, whoever controls it. */
    isOnWinningSide(card: DrawCard): boolean {
        return !!this.winner && this.isParticipatingFor(card, this.winner);
    }

    /** "this character loses the conflict": it participates on the losing side, whoever controls it. */
    isOnLosingSide(card: DrawCard): boolean {
        return !!this.loser && this.isParticipatingFor(card, this.loser);
    }

    /** "this character won the conflict", after the conflict: it was on the winning side when the winner was determined, even if it left the conflict afterwards (False Loyalties). */
    wonAtResolution(card: DrawCard): boolean {
        if(!this.winner) {
            return false;
        }
        return (this.winner === this.attackingPlayer ? this.attackersAtResolution : this.defendersAtResolution).includes(card);
    }

    /** "this character wins the conflict as an attacker", fixed when the winner is determined (as `wonAtResolution`). */
    wonAsAttacker(card: DrawCard): boolean {
        return this.winner === this.attackingPlayer && this.attackersAtResolution.includes(card);
    }

    private isParticipatingFor(card: DrawCard, player: Player): boolean {
        return this.isParticipating(card) && (player === this.attackingPlayer ? this.isAttacking(card) : this.isDefending(card));
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    getCharacters(player?: Player) {
        if(!player) {
            return [];
        }
        return this.attackingPlayer === player ? this.getAttackers() : this.getDefenders();
    }

    passConflict(message: MessageArgs = msg`${this.attackingPlayer} has chosen to pass their conflict opportunity`) {
        this.game.addMessage(message);
        this.conflictPassed = true;
        if(this.ring) {
            this.ring.resetRing();
        }
        this.game.recordConflict(this);
        this.game.updateCurrentConflict(null);
        this.game.raiseEvent(EventName.OnConflictPass, { conflict: this });
        this.resetCards();
    }

    public isAtStrongholdProvince(): boolean {
        for(const province of this.getConflictProvinces()) {
            if(province.location === Location.StrongholdProvince) {
                return true;
            }
        }
        return false;
    }
}
