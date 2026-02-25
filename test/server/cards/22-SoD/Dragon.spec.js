describe('SoD - Dragon', function () {
    integration(function () {
        describe('road-to-shakyaku-mura', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker', 'ancient-master', 'togashi-hoshi', 'callow-delegate'],
                        hand: ['fine-katana', 'ornate-fan'],
                        dynastyDiscard: ['road-to-shakyaku-mura']
                    },
                    player2: {
                        inPlay: ['keeper-initiate'],
                        hand: ['assassination', 'let-go']
                    }
                });

                this.road = this.player1.findCardByName('road-to-shakyaku-mura');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.callowDelegate = this.player1.findCardByName('callow-delegate');
                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.hoshi = this.player1.findCardByName('togashi-hoshi');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.shameful = this.player1.findCardByName('shameful-display', 'province 1');
                this.player1.moveCard(this.road, 'province 1');

                this.p1_1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.p1_2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.p1_3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.p1_4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.p1_4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.p1_Stronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.assassination = this.player2.findCardByName('assassination');
                this.letGo = this.player2.findCardByName('let-go');
            });

            it('should return all attachments to hand and the character to the province', function () {
                this.player1.playAttachment(this.fineKatana, this.berserker);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: []
                });

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.berserker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.road);
                this.player1.clickCard(this.road);

                expect(this.berserker.location).toBe(this.shameful.location);
                expect(this.fineKatana.location).toBe('hand');
                expect(this.player1).toHavePrompt('conflict action window');
                expect(this.getChatLogs(5)).toContain('player1 uses Road to Shakyaku Mura, sacrificing Road to Shakyaku Mura to prevent Matsu Berserker from leaving play, putting it into province 1 instead');
            });
        });

        describe('Strike as the Elements', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tattooed-wanderer'],
                        hand: ['strike-as-the-elements']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['assassination']
                    }
                });

                this.monk = this.player1.findCardByName('tattooed-wanderer');
                this.strike = this.player1.findCardByName('strike-as-the-elements');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should claim ring, give fate, and +2 mil', function () {
                this.game.rings.fire.fate = 5;
                this.player1.claimRing('earth');
                this.player2.claimRing('void');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.monk],
                    defenders: [this.yokuni]
                });

                const mil = this.monk.getMilitarySkill();
                const fate = this.player1.fate;

                this.player2.pass();
                this.player1.clickCard(this.strike);
                this.player1.clickCard(this.monk);

                expect(this.player1).not.toBeAbleToSelectRing('air');
                expect(this.player1).not.toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('void');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('water');

                this.player1.clickRing('fire');

                expect(this.player1.fate).toBe(fate + 5);
                expect(this.monk.getMilitarySkill()).toBe(mil + 2);

                expect(this.game.rings.fire.conflictType).toBe('military');
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.game.rings.fire.isClaimed()).toBe(true);


                expect(this.getChatLogs(5)).toContain('player1 plays Strike as the Elements to grant +2military to Tattooed Wanderer and claim the Fire Ring');
            });
        });

        describe('Hundred Hand Strike', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tattooed-wanderer'],
                        hand: ['the-hundred-hand-strike']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['assassination']
                    }
                });

                this.monk = this.player1.findCardByName('tattooed-wanderer');
                this.strike = this.player1.findCardByName('the-hundred-hand-strike');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should give a penalty and then potentially injure', function () {
                this.game.rings.fire.fate = 1;
                this.yokuni.fate = 1;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.monk],
                    defenders: [this.yokuni]
                });

                this.player2.pass();
                this.player1.clickCard(this.strike);
                this.player1.clickCard(this.monk);
                this.player1.clickCard(this.yokuni);

                expect(this.yokuni.getMilitarySkill()).toBe(1);
                expect(this.yokuni.fate).toBe(1);

                expect(this.getChatLogs(5)).toContain('player1 plays The Hundred Hand Strike to give Togashi Yokuni -4military and -4political');
            });

            it('should give a penalty and then potentially injure', function () {
                this.game.rings.fire.fate = 1;
                this.game.rings.void.fate = 1;
                this.yokuni.fate = 1;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.monk],
                    defenders: [this.yokuni]
                });

                this.player2.pass();
                this.player1.clickCard(this.strike);
                this.player1.clickCard(this.monk);
                this.player1.clickCard(this.yokuni);

                expect(this.yokuni.getMilitarySkill()).toBe(0);
                expect(this.yokuni.fate).toBe(0);

                expect(this.getChatLogs(5)).toContain('player1 plays The Hundred Hand Strike to give Togashi Yokuni -6military and -6political');
                expect(this.getChatLogs(5)).toContain('Togashi Yokuni is injured because it is not contributing skill to the current conflict');
            });

            it('should give a penalty and then potentially injure', function () {
                this.yokuni.fate = 1;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.monk],
                    defenders: [this.yokuni]
                });

                this.yokuni.bow();

                this.player2.pass();
                this.player1.clickCard(this.strike);
                this.player1.clickCard(this.monk);
                this.player1.clickCard(this.yokuni);

                expect(this.yokuni.getMilitarySkill()).toBe(3);
                expect(this.yokuni.fate).toBe(0);

                expect(this.getChatLogs(5)).toContain('player1 plays The Hundred Hand Strike to give Togashi Yokuni -2military and -2political');
                expect(this.getChatLogs(5)).toContain('Togashi Yokuni is injured because it is not contributing skill to the current conflict');
            });
        });

        describe('Kayo', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kayo-the-shrinetender', 'venerable-fortunist'],
                        stronghold: ['temple-of-the-fivefold-path'],
                        hand: ['good-omen', 'good-omen'],
                        dynastyDiscard: ['adorned-temple'],
                        provinces: ['sacred-sanctuary']
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.kayo = this.player1.findCardByName('kayo-the-shrinetender');
                this.keeper = this.player1.findCardByName('venerable-fortunist');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.omen1 = this.player1.filterCardsByName('good-omen')[0];
                this.omen2 = this.player1.filterCardsByName('good-omen')[1];

                this.sh = this.player1.findCardByName('temple-of-the-fivefold-path');
                this.sacred = this.player1.findCardByName('sacred-sanctuary');
                this.adorned = this.player1.findCardByName('adorned-temple');
                this.player1.placeCardInProvince(this.adorned, 'province 1');

                this.keeper.honor();
            });

            it('stronghold', function () {
                this.player1.clickCard(this.sh);
                this.player1.clickRing('fire');

                expect(this.getChatLogs(5)).toContain('player1 uses Temple of the Fivefold Path, bowing Temple of the Fivefold Path to place 1 fate on Fire Ring');

                this.player2.pass();
                this.player1.clickCard(this.kayo);
                expect(this.player1).toBeAbleToSelect(this.sh);
                expect(this.player1).toBeAbleToSelect(this.adorned);
                expect(this.player1).not.toBeAbleToSelect(this.sacred); // face down

                expect(this.sh.bowed).toBe(true);
                this.player1.clickCard(this.sh);
                expect(this.sh.bowed).toBe(false);

                this.player2.pass();

                this.player1.clickCard(this.sh);
                this.player1.clickPrompt('Place fate on a ring without fate');
                this.player1.clickRing('air');

                expect(this.sh.bowed).toBe(true);
            });

            it('holding', function () {
                let hand = this.player1.hand.length;
                this.player1.player.showBid = 1;
                this.player2.player.showBid = 5;

                this.player1.clickCard(this.omen1);
                this.player1.clickCard(this.keeper);
                expect(this.player1).toBeAbleToSelect(this.adorned);
                this.player1.clickCard(this.adorned);

                this.player2.pass();
                this.player1.clickCard(this.kayo);
                this.player1.clickCard(this.adorned);
                this.player2.pass();

                this.player1.clickCard(this.omen2);
                this.player1.clickCard(this.keeper);
                expect(this.player1).toBeAbleToSelect(this.adorned);
                this.player1.clickCard(this.adorned);

                expect(this.player1.hand.length).toBe(hand);
                expect(this.keeper.fate).toBe(2);
            });

            it('province', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.diplomat],
                    province: this.sacred
                });

                this.player1.clickCard(this.sacred);
                this.player1.clickCard(this.keeper);
                this.player1.clickCard(this.keeper);
                this.player1.clickPrompt('Done');

                this.noMoreActions();

                this.noMoreActions();
                this.player1.passConflict();
                this.diplomat.bowed = false;
                this.player1.clickCard(this.kayo);
                this.player1.clickCard(this.sacred);
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.diplomat],
                    province: this.sacred,
                    ring: 'fire'
                });

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sacred);
            });
        });
    });
});

