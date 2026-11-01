describe('Castle of the Forgotten', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-gunso', 'akodo-kage'],
                    hand: ['suffer-the-consequences'],
                    stronghold: ['castle-of-the-forgotten']
                },
                player2: {
                    inPlay: ['border-rider', 'moto-horde']
                }
            });
            this.castle = this.player1.findCardByName('castle-of-the-forgotten');
            this.akodoGunso = this.player1.findCardByName('akodo-gunso');
            this.akodoKage = this.player1.findCardByName('akodo-kage');
            this.suffer = this.player1.findCardByName('suffer-the-consequences');

            this.borderRider = this.player2.findCardByName('border-rider');
            this.motoHorde = this.player2.findCardByName('moto-horde');
        });

        it('should trigger when a province is broken', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.castle);
        });

        it('should set all future conflicts to be military', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.castle);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(2);

            expect(this.getChatLogs(5)).toContain('player1 uses Castle of the Forgotten, bowing Castle of the Forgotten to make all future conflicts military for this round');
        });

        it('should make all added conflicts be military', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.castle);
            this.player1.clickPrompt('Don\'t Resolve');
            this.player1.clickCard(this.suffer);
            this.player1.clickCard(this.akodoGunso);

            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player1.player.getConflictOpportunities()).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(2);
        });

        it('should work properly with conflict counting', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoGunso, this.akodoKage],
                defenders: [],
                type: 'military'
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.castle);
            this.player1.clickPrompt('Don\'t Resolve');

            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(2);

            this.noMoreActions();
            this.player2.passConflict();
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(0);
            expect(this.player2.player.getConflictOpportunities()).toBe(1);
        });
    });
});

describe('Castle of the Forgotten other breaks', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    stronghold: ['castle-of-the-forgotten'],
                    inPlay: ['doji-whisperer'],
                    hand: ['feeding-an-army']
                },
                player2: {
                    inPlay: ['border-rider'],
                    hand: ['feeding-an-army']
                }
            });
            this.castle = this.player1.findCardByName('castle-of-the-forgotten');
            this.ownFeeding = this.player1.findCardByName('feeding-an-army');
            this.opponentsFeeding = this.player2.findCardByName('feeding-an-army');
            this.ownProvince = this.player1.findCardByName('shameful-display', 'province 1');
            this.opponentsProvince = this.player2.findCardByName('shameful-display', 'province 1');
            this.ownProvince.facedown = false;
            this.opponentsProvince.facedown = false;
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
        });

        it('reacts when the opponent breaks their own province outside a conflict, as you broke it', function() {
            this.player1.pass();
            this.player2.clickCard(this.opponentsFeeding);
            this.player2.clickCard(this.opponentsProvince);
            this.player1.clickPrompt('No');
            expect(this.opponentsProvince.isBroken).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.castle);
        });

        it('does not react when you break your own province', function() {
            this.player1.clickCard(this.ownFeeding);
            this.player1.clickCard(this.ownProvince);
            this.player2.clickPrompt('No');
            expect(this.ownProvince.isBroken).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 has broken Shameful Display!');
            expect(this.player1).not.toBeAbleToSelect(this.castle);
        });
    });
});

describe('Castle of the Forgotten after a break outside the conflict phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    stronghold: 'ebony-blood-garrison',
                    inPlay: ['hida-guardian'],
                    provinces: ['manicured-garden', 'avalanche-of-stone']
                },
                player2: {
                    stronghold: 'castle-of-the-forgotten',
                    inPlay: ['doji-whisperer'],
                    provinces: ['entrenched-position', 'retire-to-the-brotherhood']
                }
            });
            this.ebonyBloodGarrison = this.player1.findCardByName('ebony-blood-garrison');
            this.hidaGuardian = this.player1.findCardByName('hida-guardian');
            this.manicuredGarden = this.player1.findCardByName('manicured-garden');
            this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
            this.retire = this.player2.findCardByName('retire-to-the-brotherhood');
            this.castle = this.player2.findCardByName('castle-of-the-forgotten');
            this.noMoreActions();
        });

        it('keeps the conflicts military for the rest of the round ("this round")', function () {
            this.player1.clickCard(this.ebonyBloodGarrison);
            this.player1.clickCard(this.manicuredGarden);
            this.player1.clickCard(this.entrenchedPosition);
            this.player2.clickPrompt('No');
            this.player1.clickPrompt('No');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.castle);
            expect(this.getChatLogs(5)).toContain('player2 uses Castle of the Forgotten, bowing Castle of the Forgotten to make all future conflicts military for this round');

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
            expect(this.game.currentPhase).toBe('conflict');
            this.initiateConflict({
                type: 'political',
                attackers: [this.hidaGuardian],
                province: this.retire
            });
            expect(this.game.currentConflict.conflictType).toBe('military');
        });
    });
});
