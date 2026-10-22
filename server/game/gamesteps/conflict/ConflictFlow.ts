import { msg } from '../../GameChat.js';
import { type AbilityContext } from '../../AbilityContext.js';
import type DrawCard from '../../DrawCard.js';
import { BaseStepWithPipeline } from '../BaseStepWithPipeline.js';
import { discardCard } from '../../costs/boardCosts.js';
import type BaseCard from '../../BaseCard.js';
import { payFate, payFateToRing, payHonor } from '../../costs/fateAndHonorCosts.js';
import { covertContexts } from './covertContexts.js';
import { bow, breakProvince, loseHonor, resolveConflictRing, reveal } from '../../GameActions/GameActions.js';
import { takeAllFateFromRing } from '../../GameActions/TakeFateFromRingAction.js';
import { SimpleStep } from '../SimpleStep.js';
import { ConflictActionWindow } from './ConflictActionWindow.js';
import { InitiateConflictPrompt } from './InitiateConflictPrompt.js';
import { SelectDefendersPrompt } from './SelectDefendersPrompt.js';
import { InitiateCardAbilityEvent } from '../../Events/InitiateCardAbilityEvent.js';
import { AttackersMatrix } from './AttackersMatrix.js';

import { Players, CardType, EventName, EffectName, Location, ConflictType, RestrictionType } from '../../Constants.js';
import type Player from '../../Player.js';
import type Game from '../../Game.js';
import type Ring from '../../Ring.js';
import type { Conflict } from '../../Conflict.js';
import type { ParticipantCostEffect } from '../../Effects/EffectValueMap.js';
import { payAdditionalCost } from '../../costs/additionalCost.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type { Event } from '../../Events/Event.js';
import type { AnyEvent } from '../../TriggeredAbilityContext.js';

/**
Conflict Resolution
3.2 Declare Conflict
3.2.1 Declare defenders
3.2.2 CONFLICT ACTION WINDOW
    (Defender has first opportunity)
3.2.3 Compare skill values.
3.2.4 Apply unopposed.
3.2.5 Break province.
3.2.6 Resolve Ring effects.
3.2.7 Claim ring.
3.2.8 Return home. Go to (3.3).
 */

export class ConflictFlow extends BaseStepWithPipeline {
    conflict: Conflict;
    canPass: boolean;
    covert: AbilityContext<DrawCard, DrawCard>[];
    #resultChosenManually = false;

    constructor(game: Game, conflict: Conflict, canPass: boolean = true) {
        super(game);
        this.conflict = conflict;
        this.canPass = canPass;
        this.covert = [];
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.declareConflict()),
            new SimpleStep(this.game, () => this.announceAttackerSkill()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.payDefendersCost()),
            new SimpleStep(this.game, () => this.announceDefenderSkill()),
            new SimpleStep(this.game, () => this.openConflictActionWindow()),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.afterConflict()),
            new SimpleStep(this.game, () => this.applyUnopposed()),
            new SimpleStep(this.game, () => this.checkBreakProvince()),
            new SimpleStep(this.game, () => this.resolveRingEffects()),
            new SimpleStep(this.game, () => this.claimRing()),
            new SimpleStep(this.game, () => this.returnHome()),
            new SimpleStep(this.game, () => this.completeConflict())
        ]);
    }

    private get conflictCancelled(): boolean {
        return this.conflict.conflictPassed || this.conflict.conflictFailedToInitiate;
    }

    resetCards(): void {
        this.conflict.resetCards();
    }

    declareConflict(): void {
        this.game.raiseEvent(EventName.OnConflictDeclared, { conflict: this.conflict }, (event) => {
            this.game.queueSimpleStep(() => this.promptForNewConflict());
            this.game.queueSimpleStep(() => {
                if(!this.conflictCancelled) {
                    event.type = this.conflict.conflictType;
                    event.ring = this.conflict.ring;
                    event.attackers = this.conflict.attackers.slice();
                    event.ringFate = this.conflict.ring?.fate;
                }
            });
            this.game.queueSimpleStep(() => this.payAttackerCosts());
            this.game.queueSimpleStep(() => this.payProvinceCosts());
            this.game.queueSimpleStep(() => this.initiateConflict());
            this.game.queueSimpleStep(() => {
                if(this.conflictCancelled) {
                    event.cancel();
                }
            });
            this.game.queueSimpleStep(() => this.revealProvince());
        });
    }

    promptForNewConflict(): void {
        const attackerMatrix = new AttackersMatrix(
            this.conflict.attackingPlayer,
            this.conflict.attackingPlayer.cardsInPlay,
            this.game
        );
        if(!attackerMatrix.canPass) {
            this.canPass = false;
        }

        const events = [
            this.game.getEvent(
                EventName.OnConflictOpportunityAvailable,
                {
                    attackerMatrix: attackerMatrix,
                    type: this.conflict.conflictType,
                    player: this.conflict.attackingPlayer
                },
                () => {
                    const defendersChosenFirst = this.conflict.attackingPlayer.mostRecentEffect(EffectName.DefendersChosenFirstDuringConflict);
                    if(defendersChosenFirst !== undefined) {
                        attackerMatrix.requiredNumberOfAttackers = defendersChosenFirst;
                        this.canPass = false;
                        this.promptForDefenders(true);
                    }
                    if(
                        this.conflict.attackingPlayer.checkRestrictions(
                            RestrictionType.ChooseConflictRing,
                            this.game.getFrameworkContext(this.conflict.attackingPlayer)
                        ) ||
                        !this.conflict.attackingPlayer.opponent
                    ) {
                        this.game.updateCurrentConflict(this.conflict);
                        this.pipeline.queueStep(
                            new InitiateConflictPrompt(
                                this.game,
                                this.conflict,
                                this.conflict.attackingPlayer,
                                true,
                                this.canPass,
                                attackerMatrix
                            )
                        );
                        return;
                    }

                    if(this.canPass) {
                        this.game.promptWithHandlerMenu(this.conflict.attackingPlayer, {
                            source: 'Declare Conflict',
                            activePromptTitle: 'Do you wish to declare a conflict?',
                            options: [
                                { text: 'Declare a conflict', handler: () => this.defenderChoosesRing(attackerMatrix) },
                                { text: 'Pass conflict opportunity', handler: () => this.conflict.passConflict() }
                            ]
                        });
                    } else {
                        this.defenderChoosesRing(attackerMatrix);
                    }
                }
            )
        ];

        this.game.openEventWindow(events);
    }

    defenderChoosesRing(attackerMatrix: AttackersMatrix): void {
        this.game.promptForRingSelect(this.conflict.defendingPlayer, {
            activePromptTitle: 'Choose a ring for ' + this.conflict.attackingPlayer.name + '\'s conflict',
            source: 'Defender chooses conflict ring',
            waitingPromptTitle: 'Waiting for defender to choose conflict ring',
            ringCondition: (ring: Ring) =>
                this.conflict.attackingPlayer.hasLegalConflictDeclaration({ ring }) &&
                (attackerMatrix.isCombinationValid(ring, ConflictType.Political) ||
                    attackerMatrix.isCombinationValid(ring, ConflictType.Military)),
            onSelect: (_player: Player, ring: Ring) => {
                if(!this.conflict.attackingPlayer.hasLegalConflictDeclaration({ type: ring.conflictType, ring })) {
                    ring.flipConflictType();
                }
                this.conflict.ring = ring;
                ring.contested = true;
                this.game.updateCurrentConflict(this.conflict);
                this.pipeline.queueStep(
                    new InitiateConflictPrompt(
                        this.game,
                        this.conflict,
                        this.conflict.attackingPlayer,
                        false,
                        false,
                        attackerMatrix
                    )
                );
                return true;
            }
        });
    }

    payAttackerCosts(): void {
        this.game.updateCurrentConflict(null);
        if(!this.conflict.conflictPassed) {
            const totalFateCost = this.conflict.attackers.reduce(
                (total: number, card: DrawCard) => total + card.sumEffects(EffectName.FateCostToAttack),
                0
            );
            const totalHonorCost = this.conflict.attackers.reduce(
                (total: number, card: DrawCard) => {
                    const effects = card.getEffects(EffectName.HonorCostToDeclare);
                    const sum = effects.reduce((total, effect) => total + effect.amount, 0);
                    return total + sum;
                },
                0
            );
            const totalCardCost =
                this.conflict.conflictType === ConflictType.Military
                    ? this.conflict.attackers.reduce(
                        (total: number, card: DrawCard) => total + card.sumEffects(EffectName.CardCostToAttackMilitary),
                        0
                    )
                    : 0;
            const costEvents: Event[] = [];
            if(!this.conflict.conflictPassed && totalFateCost > 0) {
                this.game.addMessage(msg`${this.conflict.attackingPlayer} pays ${totalFateCost} fate to declare their attackers`);
                payFate(totalFateCost).addEventsToArray?.(
                    costEvents,
                    this.game.getFrameworkCostContext(this.conflict.attackingPlayer)
                );
            }
            if(!this.conflict.conflictPassed && totalHonorCost > 0) {
                this.game.addMessage(msg`${this.conflict.attackingPlayer} pays ${totalHonorCost} honor to declare their attackers`);
                this.conflict.attackers.forEach((card) => {
                    const effects = card.getEffects(EffectName.HonorCostToDeclare);
                    effects.forEach((effect) => {
                        payHonor(effect.amount, effect.dueToStatusToken).addEventsToArray?.(
                            costEvents,
                            this.game.getFrameworkCostContext(this.conflict.attackingPlayer)
                        );
                    });
                });
            }
            if(!this.conflict.conflictPassed && totalCardCost > 0) {
                this.game.addMessage(msg`${this.conflict.attackingPlayer} must discard ${totalCardCost} card${totalCardCost > 1 ? 's' : ''} to declare their attackers`);
                const props = {
                    numCards: totalCardCost,
                    manuallyRaiseEvent: true,
                    message: (_context: AbilityContext, cards: BaseCard[], chooser: Player) => msg`${chooser} discards ${cards}`
                };
                discardCard(props).addEventsToArray?.(
                    costEvents,
                    this.game.getFrameworkCostContext(this.conflict.attackingPlayer),
                    {}
                );
            }
            if(costEvents.length > 0) {
                this.game.openEventWindow(costEvents);
            }
            this.conflict.attackerDeclarationFailed = false;
            this.queueParticipantCosts('attackers', () => this.conflict.attackingPlayer, 'declare attacking characters', () => {
                this.conflict.attackerDeclarationFailed = true;
                this.conflict.conflictFailedToInitiate = true;
            });
        }
    }

    payProvinceCosts(): void {
        this.game.updateCurrentConflict(null);
        if(!this.conflict.conflictPassed) {
            const provinceSlot = this.conflict.conflictProvince
                ? this.conflict.conflictProvince.location
                : Location.ProvinceOne;
            const province =
                this.conflict.conflictProvince || this.conflict.defendingPlayer.getProvinceCardInProvince(provinceSlot);
            const provinceName =
                this.conflict.conflictProvince && this.conflict.conflictProvince.isFacedown()
                    ? provinceSlot
                    : this.conflict.conflictProvince;

            const totalFateCost = province ? province.getFateCostToAttack() : 0;
            if(!this.conflict.conflictPassed && province && totalFateCost > 0) {
                const attacker = this.conflict.attackingPlayer;
                const costEvents: Event[] = [];
                payFateToRing(totalFateCost).addEventsToArray?.(costEvents, this.game.getFrameworkCostContext(attacker), {});
                this.game.queueSimpleStep(() => this.game.openThenEventWindow(costEvents));
                this.game.queueSimpleStep(() => {
                    const placeFateEvent: AnyEvent | undefined = costEvents[0];
                    if(!placeFateEvent || costEvents.some((event) => event.cancelled || !event.resolved)) {
                        this.game.addMessage(msg`${attacker} cannot pay the fate to declare a conflict at ${provinceName}`);
                        this.conflict.attackerDeclarationFailed = true;
                        this.conflict.conflictFailedToInitiate = true;
                        return;
                    }
                    this.game.addMessage(msg`${attacker} pays ${totalFateCost} fate to declare a conflict at ${provinceName}`);
                    this.game.addMessage(msg`${attacker} places ${totalFateCost} fate on the ${placeFateEvent.recipient || 'ring'}`);
                });
            }
        }
    }

    initiateConflict(): void {
        if(this.conflict.conflictPassed || this.conflict.attackerDeclarationFailed) {
            return;
        }

        const provinceSlot = this.conflict.conflictProvince
            ? this.conflict.conflictProvince.location
            : Location.ProvinceOne;
        const provinceName =
            this.conflict.conflictProvince && this.conflict.conflictProvince.isFacedown()
                ? provinceSlot
                : this.conflict.conflictProvince;
        this.game.addMessage(msg`${this.conflict.attackingPlayer} is initiating a ${this.conflict.conflictType} conflict at ${provinceName}, contesting ${this.conflict.ring}`);

        const params = {
            conflict: this.conflict,
            type: this.conflict.conflictType,
            ring: this.conflict.ring,
            attackers: this.conflict.attackers.slice(),
            ringFate: this.conflict.ring?.fate
        };

        this.game.openThenEventWindow(
            this.game.getEvent(EventName.OnConflictDeclaredBeforeProvinceReveal, params, (event: Event) => {
                if(this.conflict.attackers.some((a: DrawCard) => a.location === Location.PlayArea)) {
                    this.game.updateCurrentConflict(this.conflict);
                    this.conflict.declaredProvince = this.conflict.conflictProvince ?? null;
                    if(this.conflict.conflictProvince) {
                        this.conflict.conflictProvince.inConflict = true;
                    }
                    this.conflict.attackers.forEach((card: DrawCard) => (card.inConflict = true));
                    this.game.recordConflict(this.conflict);
                    const events: Event[] = this.conflict.ring
                        ? takeAllFateFromRing(this.conflict.ring, this.game.getFrameworkContext(this.conflict.attackingPlayer))
                        : [];
                    events.push(
                        this.game.getEvent(EventName.Unnamed, {}, () => {
                            this.game.queueSimpleStep(() => this.promptForCovert());
                            this.game.queueSimpleStep(() => this.resolveCovert());
                        })
                    );
                    this.game.openThenEventWindow(events);
                    this.game.raiseEvent(EventName.OnTheCrashingWave, { conflict: this.conflict });
                } else {
                    this.game.addMessage(msg`${this.conflict.attackingPlayer} has failed to initiate a conflict because they no longer have any legal attackers`);
                    this.conflict.conflictFailedToInitiate = true;
                    event.cancel();
                }
            })
        );
    }

    promptForCovert(): void {
        if(this.game.rules.covertUnified) {
            this.promptForCovertEmerald();
            return;
        }

        this.covert = [];
        // defenders declared before attackers (Seven Stings Keep): too late for covert (EmeraldDB ruling)
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer || this.conflict.defendersChosen) {
            return;
        }

        const targets = this.conflict.defendingPlayer.cardsInPlay.filter((card: DrawCard) => card.covert);
        const contexts = covertContexts(this.game, this.conflict).filter((context) => context.source.canInitiateKeywords(context));

        for(const target of targets) {
            target.covert = false;
        }

        if(contexts.length === 0) {
            return;
        }

        // Need to have:
        // - a legal combination of covert targets and covert attackers
        // - no remaining covert
        // - each target legally assigned - for Vine Tattoo and reactions like Tengu & Yasamura
        if(targets.length === contexts.length) {
            for(let i = 0; i < targets.length; i++) {
                const context = contexts[i];
                context['target'] = context.targets.target = targets[i];
                this.covert.push(context);
            }
            if(
                this.covert.every(
                    (context) =>
                        !!context.target &&
                        context.target.canBeBypassedByCovert(context) &&
                        context.target.checkRestrictions(RestrictionType.Target, context)
                )
            ) {
                return;
            }
            this.covert = [];
        }

        for(const context of contexts) {
            if(context.player.checkRestrictions(RestrictionType.InitiateKeywords, context)) {
                this.game.promptForSelect(this.conflict.attackingPlayer, {
                    activePromptTitle: 'Choose covert target for ' + context.source.name,
                    buttons: [{ text: 'No Target', arg: 'cancel' }],
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    source: 'Choose Covert',
                    cardCondition: (card: DrawCard) =>
                        card.canBeBypassedByCovert(context) && card.checkRestrictions(RestrictionType.Target, context),
                    onSelect: (_player: Player, card: DrawCard) => {
                        context['target'] = context.targets.target = card;
                        this.covert.push(context);
                        return true;
                    }
                });
            }
        }
    }

    promptForCovertEmerald(): void {
        this.covert = [];
        // defenders declared before attackers (Seven Stings Keep): too late for covert (EmeraldDB ruling)
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer || this.conflict.defendersChosen) {
            return;
        }

        const targets = this.conflict.defendingPlayer.cardsInPlay.filter((card: DrawCard) => card.covert);
        const contexts = covertContexts(this.game, this.conflict).filter((context) => context.source.canInitiateKeywords(context));

        for(const target of targets) {
            target.covert = false;
        }

        if(contexts.length === 0) {
            return;
        }

        for(const context of contexts) {
            if(!context.player.checkRestrictions(RestrictionType.InitiateKeywords, context)) {
                return;
            }
        }

        this.game.promptForSelect(this.conflict.attackingPlayer, {
            activePromptTitle: 'Choose character to evade with covert',
            buttons: [{ text: 'No Target', arg: 'cancel' }],
            cardType: CardType.Character,
            controller: Players.Opponent,
            source: 'Choose Covert',
            cardCondition: (card: DrawCard) => {
                let valid = false;
                for(const context of contexts) {
                    valid = valid || (card.canBeBypassedByCovert(context) && card.checkRestrictions(RestrictionType.Target, context));
                }
                return valid;
            },
            onSelect: (_player: Player, card: DrawCard) => {
                for(const context of contexts) {
                    if(card.canBeBypassedByCovert(context) && card.checkRestrictions(RestrictionType.Target, context)) {
                        context['target'] = context.targets.target = card;
                        this.covert.push(context);
                    }
                }
                return true;
            }
        });
    }

    resolveCovert(): void {
        if(this.covert.length === 0) {
            return;
        }

        // one instance per covert character: Finger of Jade cancels only one of them (EmeraldDB ruling)
        let events: Event[] = this.covert.map(
            (context) =>
                new InitiateCardAbilityEvent(
                    { card: context.source, context: context },
                    () => {
                        if(context.target) {
                            context.target.covert = true;
                        }
                    }
                )
        );
        if(this.game.rules.covertUnified) {
            events = events.concat(
                this.game.getEvent(EventName.OnCovertResolved, {
                    card: this.covert.map((a: AbilityContext) => a.source),
                    context: this.covert[0]
                })
            );
        } else {
            events = events.concat(
                this.covert.map((context: AbilityContext) =>
                    this.game.getEvent(EventName.OnCovertResolved, { card: context.source, context: context })
                )
            );
        }
        this.game.openThenEventWindow(events);
    }

    revealProvince(): void {
        if(
            !this.game.currentConflict ||
            this.conflict.isSinglePlayer ||
            this.conflict.conflictPassed ||
            this.conflict.conflictFailedToInitiate
        ) {
            return;
        }

        const events: Event[] = [];
        reveal({
            chatMessage: true,
            target: this.conflict.conflictProvince ?? undefined,
            onDeclaration: true
        })
            .addEventsToArray(events, this.game.getFrameworkContext(this.conflict.attackingPlayer));
        this.game.openThenEventWindow(events);
    }

    announceAttackerSkill(): void {
        if(this.conflictCancelled) {
            return;
        }

        this.game.addMessage(msg`${this.conflict.attackingPlayer} has initiated a ${this.conflict.conflictType} conflict with skill ${this.conflict.attackerSkill}`);
    }

    promptForDefenders(beingChosenFirst = false): void {
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer || this.conflict.conflictFailedToInitiate) {
            return;
        }

        if(
            !beingChosenFirst &&
            this.conflict.attackingPlayer.anyEffect(EffectName.DefendersChosenFirstDuringConflict)
        ) {
            return;
        }

        this.game.queueStep(new SelectDefendersPrompt(this.game, this.conflict.defendingPlayer, this.conflict));
    }

    /** The declaring player's additional costs to declare `side` (CostToDeclareAnyParticipants), each in its own step; `failed` when one can't be paid. */
    private queueParticipantCosts(side: 'attackers' | 'defenders', declaringPlayer: () => Player, purpose: string, failed: () => void): void {
        const additionalCosts = declaringPlayer()
            .getEffects(EffectName.CostToDeclareAnyParticipants)
            .filter((properties: ParticipantCostEffect) => properties.type === side);
        for(const properties of additionalCosts) {
            this.game.queueSimpleStep(() => {
                const player = declaringPlayer();
                const cost = typeof properties.cost === 'function' ? properties.cost(player) : properties.cost;
                if(!payAdditionalCost(this.game.getFrameworkCostContext(player), player, cost, player, purpose, properties.chatText)) {
                    failed();
                }
            });
        }
    }

    payDefendersCost(): void {
        if(this.conflict.defenders.length > 0) {
            this.conflict.defenderDeclarationFailed = false;
            this.queueParticipantCosts('defenders', () => this.conflict.defendingPlayer, 'declare defending characters', () => {
                this.conflict.defenderDeclarationFailed = true;
            });

            const totalHonorCost = this.conflict.defenders.reduce(
                (total: number, card: DrawCard) => {
                    const effects = card.getEffects(EffectName.HonorCostToDeclare);
                    const sum = effects.reduce((total, effect) => total + effect.amount, 0);
                    return total + sum;
                },
                0
            );
            if(!this.conflict.conflictPassed && totalHonorCost > 0) {
                const costEvents: Event[] = [];
                this.game.addMessage(msg`${this.conflict.defendingPlayer} pays ${totalHonorCost} honor to declare their defenders`);
                this.conflict.defenders.forEach((card) => {
                    const effects = card.getEffects(EffectName.HonorCostToDeclare);
                    effects.forEach((effect) => {
                        payHonor(effect.amount, effect.dueToStatusToken).addEventsToArray?.(
                            costEvents,
                            this.game.getFrameworkCostContext(this.conflict.defendingPlayer)
                        );
                    });
                });
                this.game.openEventWindow(costEvents);
            }
        }
    }

    announceDefenderSkill(): void {
        if(this.conflict.conflictPassed || this.conflict.isSinglePlayer || this.conflict.conflictFailedToInitiate) {
            return;
        }

        if(this.conflict.defenderDeclarationFailed) {
            for(const card of this.conflict.defenders) {
                this.conflict.removeFromConflict(card);
            }
            this.conflict.defenders = [];
        }

        this.conflict.defenders.forEach((card: DrawCard) => (card.inConflict = true));
        this.conflict.defendingPlayer.cardsInPlay.forEach((card: DrawCard) => (card.covert = false));

        if(this.conflict.defenders.length > 0) {
            this.game.addMessage(msg`${this.conflict.defendingPlayer} has defended with skill ${this.conflict.defenderSkill}`);
        } else {
            this.game.addMessage(msg`${this.conflict.defendingPlayer} does not defend the conflict`);
        }
    }

    openConflictActionWindow(): void {
        if(this.conflictCancelled) {
            return;
        }
        this.game.raiseEvent(EventName.OnConflictStarted, { conflict: this.conflict });
        this.queueStep(new ConflictActionWindow(this.game, 'Conflict Action Window', this.conflict));
    }

    determineWinner(): void {
        if(this.conflictCancelled) {
            return;
        }

        if(this.game.manualMode && !this.conflict.isSinglePlayer) {
            this.game.promptWithMenu(this.conflict.attackingPlayer, {
                manuallyDetermineWinner: (player, choice) => this.manuallyDetermineWinner(player, choice)
            }, {
                activePrompt: {
                    promptTitle: 'Conflict Result',
                    menuTitle: 'How did the conflict resolve?',
                    buttons: [
                        { text: 'Attacker Won', arg: 'attacker', method: 'manuallyDetermineWinner' },
                        { text: 'Defender Won', arg: 'defender', method: 'manuallyDetermineWinner' },
                        { text: 'No Winner', arg: 'nowinner', method: 'manuallyDetermineWinner' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to resolve conflict'
            });
            return;
        }

        this.conflict.determineWinner();
    }

    manuallyDetermineWinner(player: Player, choice: string): boolean {
        this.#resultChosenManually = true;
        if(choice === 'attacker') {
            this.conflict.winner = player;
            this.conflict.loser = this.conflict.defendingPlayer;
        } else if(choice === 'defender') {
            this.conflict.winner = this.conflict.defendingPlayer;
            this.conflict.loser = player;
        }
        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage(msg`There is no winner or loser for this conflict because both sides have 0 skill`);
        } else {
            this.game.addMessage(msg`${this.conflict.winner} won a ${this.conflict.conflictType} conflict`);
        }
        return true;
    }

    showConflictResult(): void {
        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage(msg`There is no winner or loser for this conflict because both sides have 0 skill`);
        } else {
            this.game.addMessage(msg`${this.conflict.winner} won a ${this.conflict.conflictType} conflict ${this.conflict.winnerSkill} vs ${this.conflict.loserSkill}`);
        }
    }

    afterConflict(): void {
        if(this.conflictCancelled) {
            return;
        }

        this.game.checkGameState(true);

        const eventFactory = () => {
            const event = this.game.getEvent(EventName.AfterConflict, { conflict: this.conflict }, () => {
                const effects = this.conflict.getEffects(EffectName.ForceConflictUnopposed);
                const forcedUnopposed = effects.length !== 0;

                this.showConflictResult();
                this.game.recordConflictWinner(this.conflict);

                if((this.conflict.isAttackerTheWinner() && this.conflict.defenders.length === 0) || forcedUnopposed) {
                    this.conflict.conflictUnopposed = true;
                }
            });
            event.condition = (afterConflictEvent: AnyEvent) => {
                if(this.#resultChosenManually) {
                    return true;
                }
                const prevWinner = afterConflictEvent.conflict?.winner;
                this.conflict.winnerDetermined = false;
                this.conflict.determineWinner();
                if(this.conflict.winner !== prevWinner) {
                    const newEvent = eventFactory();
                    afterConflictEvent.window?.addEvent(newEvent);
                    return false;
                }
                return true;
            };
            return event;
        };

        this.game.openEventWindow(eventFactory());
    }

    applyUnopposed(): void {
        if(
            this.conflict.conflictPassed ||
            this.game.manualMode ||
            this.conflict.isSinglePlayer ||
            this.conflict.conflictFailedToInitiate
        ) {
            return;
        }

        if(!this.game.rules.conflictHaveUnopposedHonorLoss) {
            if(this.conflict.conflictUnopposed) {
                this.game.addMessage(msg`${this.conflict.winner} has won an unopposed conflict`);
            }
            return;
        }

        if(this.conflict.conflictUnopposed) {
            const prevention = this.conflict.loser?.getRawEffects().find((effect) => effect.type === EffectName.NoUnopposedHonorLoss);
            if(prevention) {
                this.game.addMessage(msg`${prevention.context.source} prevents ${this.conflict.loser} from losing honor for not defending the conflict`);
                return;
            }
            const honorLossMods = this.conflict.sumEffects(EffectName.ModifyUnopposedHonorLoss);

            const honorLoss = Math.max(0, 1 + honorLossMods);
            this.game.addMessage(msg`${this.conflict.loser} loses ${honorLoss} honor for not defending the conflict`);
            loseHonor({ dueToUnopposed: true, amount: honorLoss }).resolve(
                this.conflict.loser,
                this.conflict.loser ? this.game.getFrameworkContext(this.conflict.loser) : this.game.getGameContext()
            );
        }
    }

    checkBreakProvince(): void {
        if(
            this.conflict.conflictPassed ||
            this.conflict.isSinglePlayer ||
            this.game.manualMode ||
            this.conflict.conflictFailedToInitiate
        ) {
            return;
        }

        this.conflict.provinceStrengthsAtResolution.forEach((a: { province: ProvinceCard; strength: number }) => {
            const province = a.province;
            const strength = a.strength === undefined ? province.getStrength() : a.strength;
            if(
                this.conflict.isAttackerTheWinner() &&
                this.conflict.skillDifference !== undefined && this.conflict.skillDifference >= strength &&
                !province.isBroken
            ) {
                this.game.resolveActions([breakProvince({ target: province })]);
            }
        });
    }

    resolveRingEffects(): void {
        if(this.conflictCancelled) {
            return;
        }

        if(this.conflict.isAttackerTheWinner()) {
            resolveConflictRing().resolve(
                this.conflict.ring,
                this.game.getFrameworkContext(this.conflict.attackingPlayer)
            );
        }
    }

    claimRing(): void {
        if(this.conflict.conflictFailedToInitiate) {
            this.conflict.ring?.resetRing();
            return;
        }
        if(this.conflictCancelled) {
            return;
        }

        const ring = this.conflict.ring;
        if(!ring) {
            return;
        }
        if(ring.claimed) {
            ring.contested = false;
            return;
        }
        const winner = this.conflict.winner;
        if(
            winner &&
            winner.checkRestrictions(RestrictionType.ClaimRings, this.game.getFrameworkContext(winner))
        ) {
            this.game.raiseEvent(
                EventName.OnClaimRing,
                { player: winner, conflict: this.conflict, ring },
                () => ring.claimRing(winner)
            );
        }
        //Do this lazily for now
        this.game.queueSimpleStep(() => {
            ring.contested = false;
            return true;
        });
    }

    returnHome(): void {
        if(this.conflictCancelled) {
            return;
        }
        this.conflict.attackersAtEnd = this.conflict.attackers.slice();
        this.conflict.defendersAtEnd = this.conflict.defenders.slice();

        // Create bow events for attackers
        const attackerBows = this.conflict.attackers.map((card: DrawCard) =>
            ({ card, event: bow().getEvent(card, this.game.getGameContext()) })
        );
        // Cancel any events where attacker shouldn't bow
        attackerBows.forEach(({ card, event }) => (event.cancelled = !card.bowsOnReturnHome()));

        // Create bow events for defenders
        const defenderBows = this.conflict.defenders.map((card: DrawCard) =>
            ({ card, event: bow().getEvent(card, this.game.getGameContext()) })
        );
        // Cancel any events where defender shouldn't bow
        defenderBows.forEach(({ card, event }) => (event.cancelled = !card.bowsOnReturnHome()));

        const bows = attackerBows.concat(defenderBows);
        const bowEvents: Event[] = bows.map(({ event }) => event);

        // Create a return home event for every bow event
        const returnHomeEvents = bows.map(({ card, event }) => {
            return this.game.getEvent(
                EventName.OnReturnHome,
                { conflict: this.conflict, bowEvent: event, card: card },
                () => this.conflict.removeFromConflict(card)
            );
        });
        const events: Event[] = [...bowEvents, ...returnHomeEvents];
        events.push(
            this.game.getEvent(EventName.OnParticipantsReturnHome, {
                returnHomeEvents: returnHomeEvents,
                conflict: this.conflict
            })
        );
        this.game.openEventWindow(events);
    }

    override abort(): void {
        super.abort();
        if(this.game.currentConflict === this.conflict) {
            this.game.updateCurrentConflict(null);
        }
    }

    completeConflict(): void {
        if(this.conflict.conflictPassed) {
            return;
        }

        this.game.updateCurrentConflict(null);
        this.game.raiseEvent(EventName.OnConflictFinished, { conflict: this.conflict });
        this.game.queueSimpleStep(() => this.resetCards());
    }
}

