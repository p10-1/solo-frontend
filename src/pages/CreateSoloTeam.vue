<template>
  <h2 class="title">팀 소개</h2>
  <div class="team-intro">
    <div class="team-list">
      <div v-for="(member, index) in teamMembers" :key="index" class="team-member">
        <div class="photo-box">
          <img class="member-photo" src="" alt="멤버 사진" />
        </div>
        <div class="member-info">
          <p class="member-role">{{ member.role }}</p>
          <h3 class="member-name">{{ member.name }}</h3>
          <div class="tendency-tag">
            {{ member.tag }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const teamMembers = [
  { name: '김준영', role: '개발자', tag: '#FM #친절' },
  { name: '서나연', role: '개발자', tag: '#성실 #친절 #집사' },
  { name: '심윤재', role: '개발자', tag: '#성실 #친절' },
  { name: '오지현', role: '개발자', tag: '#성실 #친절' },
  { name: '강소라', role: '디자이너', tag: '#열정 #댕댕이 주인' }
]
</script>

<style scoped>
.team-intro {
  text-align: center;
  margin: 2rem 0;
}

.team-list {
  background: #f3f3ff;
  padding: 2rem 1.5rem;
  border-radius: 28px;
}
.team-member {
  display: inline-block;
  width: 30%;
  text-align: center;
  margin: 1rem;
  overflow: hidden;
  background-color: #fff;
  border-radius: 27px;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
}
.photo-box {
  position: relative;
  background: linear-gradient(to bottom, #8a9dff, #a892ff);
  min-height: 5rem;
  padding: 1.5rem 1.5rem 1rem;
  margin-bottom: 1rem;
}
.photo-box .member-photo {
  position: absolute;
  display: inline-block;
  margin-left: -44.5px;
  bottom: -40px;
  width: 90px;
  height: 90px;
  background-color: #f1eeff;
  border: 2px solid #e4deff;
  object-fit: cover;
  border-radius: 50%;
}
.member-info {
  padding: 2.5rem 1.5rem 2rem;
}
.member-info .member-role {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6846f5;
  margin-bottom: 0.5rem;
}
.member-info .member-name {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 15px;
}
.member-info .tendency-tag {
  color: #6846f5;
  font-weight: 600;
  font-size: 0.8rem;
}
</style>
