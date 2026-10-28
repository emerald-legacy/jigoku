describe('Along the River of Gold', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'matsu-berserker', 'doji-whisperer', 'kakita-asami']
                },
                player2: {
                    inPlay: ['kaito-temple-protector', 'bayushi-liar', 'doji-challenger'],
                    provinces: {
                        'province 1': { provinceCard: 'along-the-river-of-gold' },
                        'province 2': { provinceCard: 'shachihoko-bay' },
                        'province 3': { provinceCard: 'upholding-authority' },
                        'province 4': { provinceCard: 'endless-plains' }
                    }
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.asami = this.player1.findCardByName('kakita-asami');
            this.kaito = this.player2.findCardByName('kaito-temple-protector');
            this.liar = this.player2.findCardByName('bayushi-liar');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.river = this.player2.findCardByName('along-the-river-of-gold');
            this.bay = this.player2.findCardByName('shachihoko-bay');
            this.authority = this.player2.findCardByName('upholding-authority');
            this.plains = this.player2.findCardByName('endless-plains');
        });

        it('switches the base skills of a participating character until the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.river,
                attackers: [this.brash, this.berserker],
                defenders: [this.liar, this.kaito]
            });
            this.player2.clickCard(this.river);
            expect(this.player2).toHavePrompt('Along the River of Gold');
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).toBeAbleToSelect(this.kaito);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            this.player2.clickCard(this.brash);
            expect(this.getChatLogs(5)).toContain('player2 uses Along the River of Gold to switch Brash Samurai\'s military and political skill');
            expect(this.brash.getMilitarySkill()).toBe(1);
            expect(this.brash.getPoliticalSkill()).toBe(2);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 4 vs 3');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.brash.getPoliticalSkill()).toBe(1);
        });

        // ruling #305: a dash skill cannot be switched
        it('cannot choose a character with a dash skill', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.river,
                attackers: [this.brash, this.berserker],
                defenders: [this.liar, this.kaito]
            });
            this.player2.clickCard(this.river);
            expect(this.player2).toHavePrompt('Along the River of Gold');
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).not.toBeAbleToSelect(this.berserker);
            expect(this.player2).not.toBeAbleToSelect(this.liar);
        });

        // ruling #413: skills that have been set cannot be switched
        // card bug: Kaito Temple Protector (base skills set by its own action) can be chosen vs ruling #413; canSwitchSkills only checks SetMilitarySkill/SetPoliticalSkill, not the SetBase* effects
        xit('cannot choose a character whose skills have been set', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.river,
                attackers: [this.brash, this.berserker],
                defenders: [this.liar, this.kaito]
            });
            this.player2.clickCard(this.kaito);
            this.player2.clickCard(this.brash);
            expect(this.kaito.getMilitarySkill()).toBe(2);
            expect(this.kaito.getPoliticalSkill()).toBe(1);
            this.player1.pass();
            this.player2.clickCard(this.river);
            expect(this.player2).toHavePrompt('Along the River of Gold');
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).not.toBeAbleToSelect(this.kaito);
        });

        it('cannot be used while facedown, even during a conflict at another Water province', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.bay,
                attackers: [this.brash],
                defenders: [this.kaito]
            });
            expect(this.river.facedown).toBe(true);
            this.player2.clickCard(this.river);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.brash.getMilitarySkill()).toBe(2);
        });

        describe('after it was revealed by an attack', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: this.river,
                    attackers: [this.brash],
                    defenders: [this.kaito]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 2');
                expect(this.river.facedown).toBe(false);
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
            });

            // ruling #310: a faceup Along the River of Gold works at another Water province
            it('can be used during a conflict at another Water province', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    province: this.bay,
                    attackers: [this.whisperer],
                    defenders: [this.challenger]
                });
                this.player2.clickCard(this.river);
                expect(this.player2).toHavePrompt('Along the River of Gold');
                this.player2.clickCard(this.whisperer);
                expect(this.getChatLogs(5)).toContain('player2 uses Along the River of Gold to switch Doji Whisperer\'s military and political skill');
                expect(this.whisperer.getMilitarySkill()).toBe(3);
                expect(this.whisperer.getPoliticalSkill()).toBe(0);
            });

            // ruling #326: a broken province keeps its element
            it('can be used during a conflict at a Water province that was broken', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    province: this.plains,
                    attackers: [this.whisperer, this.asami]
                });
                this.player2.clickCard(this.plains);
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.asami);
                expect(this.plains.isBroken).toBe(true);
                expect(this.asami.location).toBe('dynasty discard pile');
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.river);
                expect(this.player2).toHavePrompt('Along the River of Gold');
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.getMilitarySkill()).toBe(3);
                expect(this.whisperer.getPoliticalSkill()).toBe(0);
            });

            it('cannot be used during a conflict at a province that is not a Water province', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    province: this.authority,
                    attackers: [this.whisperer],
                    defenders: [this.challenger]
                });
                expect(this.authority.isElement('earth')).toBe(true);
                this.player2.clickCard(this.river);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
